const Database = require("better-sqlite3");

const db = new Database("ecommerce.db");

db.pragma("foreign_keys = ON");

console.log("SQLite database connected successfully!");

// USERS TABLE
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`).run();

// PRODUCTS TABLE
db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT,
        description TEXT
    )
`).run();

// INSERT DEFAULT PRODUCTS
const productCount = db
    .prepare("SELECT COUNT(*) AS count FROM products")
    .get();

if (productCount.count === 0) {

    const insertProduct = db.prepare(`
        INSERT INTO products
        (name, price, image, description)
        VALUES (?, ?, ?, ?)
    `);

    insertProduct.run(
        "Stylish T-Shirt",
        499,
        "image/tshirt.jpg",
        "Comfortable cotton T-Shirt for everyday use."
    );

    insertProduct.run(
        "Wireless Headphones",
        1499,
        "image/headphones.jpg",
        "High quality wireless headphones with clear sound."
    );

    insertProduct.run(
        "Office Chair",
        2999,
        "image/chair.jpg",
        "Comfortable chair for office and study."
    );

    insertProduct.run(
        "Running Shoes",
        1999,
        "image/shoes.jpg",
        "Lightweight and comfortable running shoes."
    );

    // NEW PRODUCTS

db.prepare(`
    INSERT OR IGNORE INTO products
    (id, name, description, price, image)
    VALUES (?, ?, ?, ?, ?)
`).run(
    5,
    "Smart Watch",
    "Stylish smart watch with fitness and health tracking features.",
    2499,
    "image/smartwatch.jpg"
);

db.prepare(`
    INSERT OR IGNORE INTO products
    (id, name, description, price, image)
    VALUES (?, ?, ?, ?, ?)
`).run(
    6,
    "Laptop Backpack",
    "Durable and spacious backpack for laptop and daily use.",
    1299,
    "image/backpack.jpg"
);

db.prepare(`
    INSERT OR IGNORE INTO products
    (id, name, description, price, image)
    VALUES (?, ?, ?, ?, ?)
`).run(
    7,
    "Sunglasses",
    "Trendy sunglasses with comfortable lightweight design.",
    799,
    "image/sunglasses.jpg"
);

db.prepare(`
    INSERT OR IGNORE INTO products
    (id, name, description, price, image)
    VALUES (?, ?, ?, ?, ?)
`).run(
    8,
    "Mechanical Keyboard",
    "Responsive mechanical keyboard for gaming and work.",
    1899,
    "image/keyboard.jpg"
);

    console.log("Products inserted successfully!");
}

// ORDERS TABLE
db.prepare(`
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        pincode TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        total REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`).run();

// ORDER ITEMS TABLE
db.prepare(`
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
`).run();

console.log("Database tables created successfully!");

module.exports = db;

const orders = db.prepare("SELECT * FROM orders").all();
console.log("ORDERS:", orders);

const orderItems = db.prepare("SELECT * FROM order_items").all();
console.log("ORDER ITEMS:", orderItems);