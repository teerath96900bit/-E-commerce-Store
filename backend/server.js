const db = require("./database");
const express = require("express");
const cors = require("cors");

const app = express();

// =============================
// MIDDLEWARE
// =============================

app.use(cors());
app.use(express.json());


// =============================
// TEST ROUTE
// =============================

app.get("/", (req, res) => {
    res.send("E-commerce Backend is Running!");
});


// =============================
// REGISTER API
// =============================

app.post("/api/register", (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {

        const existingUser = db
            .prepare("SELECT * FROM users WHERE email = ?")
            .get(email);

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const result = db
            .prepare(`
                INSERT INTO users (name, email, password)
                VALUES (?, ?, ?)
            `)
            .run(name, email, password);

        res.status(201).json({
            message: "Registration successful",
            userId: result.lastInsertRowid
        });

    } catch (error) {

        console.error("Register Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// =============================
// LOGIN API
// =============================

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {

        const user = db
            .prepare(`
                SELECT *
                FROM users
                WHERE email = ? AND password = ?
            `)
            .get(email, password);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// =============================
// GET ALL PRODUCTS API
// =============================

app.get("/api/products", (req, res) => {

    try {

        const products = db
            .prepare("SELECT * FROM products")
            .all();

        res.json(products);

    } catch (error) {

        console.error("Products Error:", error);

        res.status(500).json({
            message: "Failed to get products"
        });

    }

});


// =============================
// PLACE ORDER API
// =============================

app.post("/api/orders", (req, res) => {

    const {
        user_id,
        name,
        phone,
        address,
        city,
        pincode,
        payment_method,
        items
    } = req.body;


    // Check required fields

    if (
        !name ||
        !phone ||
        !address ||
        !city ||
        !pincode ||
        !payment_method ||
        !items ||
        items.length === 0
    ) {

        return res.status(400).json({
            message: "All order details are required"
        });

    }


    try {

        // Calculate total from database prices

        let total = 0;


        for (const item of items) {

            const product = db
                .prepare(`
                    SELECT *
                    FROM products
                    WHERE id = ?
                `)
                .get(item.product_id);


            if (!product) {

                return res.status(400).json({
                    message:
                        `Product ${item.product_id} not found`
                });

            }


            total += product.price * item.quantity;

        }


        // Create order + order items together

        const createOrder = db.transaction(() => {

            // Insert order

            const orderResult = db
                .prepare(`
                    INSERT INTO orders
                    (
                        user_id,
                        name,
                        phone,
                        address,
                        city,
                        pincode,
                        payment_method,
                        total
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `)
                .run(
                    user_id || null,
                    name,
                    phone,
                    address,
                    city,
                    pincode,
                    payment_method,
                    total
                );


            const orderId =
                orderResult.lastInsertRowid;


            // Insert order items

            const insertItem = db.prepare(`
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    quantity,
                    price
                )
                VALUES (?, ?, ?, ?)
            `);


            for (const item of items) {

                const product = db
                    .prepare(`
                        SELECT price
                        FROM products
                        WHERE id = ?
                    `)
                    .get(item.product_id);


                insertItem.run(
                    orderId,
                    item.product_id,
                    item.quantity,
                    product.price
                );

            }


            return orderId;

        });


        const orderId = createOrder();


        res.status(201).json({

            message: "Order placed successfully",

            orderId: orderId,

            total: total

        });


    } catch (error) {

        console.error("Order Error:", error);

        res.status(500).json({
            message: "Failed to place order"
        });

    }

});


// =============================
// GET USER ORDERS API
// =============================

app.get("/api/orders/:userId", (req, res) => {

    try {

        const userId =
            Number(req.params.userId);


        const orders = db
            .prepare(`
                SELECT *
                FROM orders
                WHERE user_id = ?
                ORDER BY created_at DESC
            `)
            .all(userId);


        const orderItems = db
            .prepare(`
                SELECT *
                FROM order_items
                WHERE order_id IN (
                    SELECT id
                    FROM orders
                    WHERE user_id = ?
                )
            `)
            .all(userId);


        const result = orders.map(order => {

            return {
                ...order,

                items: orderItems.filter(item => {

                    return item.order_id === order.id;

                })

            };

        });


        res.json(result);


    } catch (error) {

        console.error(
            "Order History Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch orders"
        });

    }

});


// =============================
// SERVER
// =============================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});