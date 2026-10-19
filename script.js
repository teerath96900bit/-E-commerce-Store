// =============================
// SHOPPING CART
// =============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// =============================
// CART COUNT
// =============================

const cartCount = document.getElementById("cart-count");

if (cartCount) {
    cartCount.innerText = cart.reduce(function (total, product) {
        return total + product.quantity;
    }, 0);
}


// =============================
// ADD TO CART - PRODUCT CARDS
// =============================

const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const productCard = button.closest(".product-card");

        if (!productCard) {
            return;
        }

        const productName =
            productCard.querySelector("h3").innerText;

        const productPrice =
            productCard.querySelector("h4").innerText;

        const productImage =
            productCard.querySelector("img").src;

        const productId =
            Number(productCard.dataset.productId);


        const existingProduct = cart.find(function (product) {
            return product.name === productName;
        });


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                product_id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }


        localStorage.setItem("cart", JSON.stringify(cart));


        if (cartCount) {

            cartCount.innerText = cart.reduce(function (total, product) {
                return total + product.quantity;
            }, 0);

        }


        alert(productName + " added to cart!");

    });

});


// =============================
// OPEN CART
// =============================

function openCart() {
    window.location.href = "cart.html";
}


// =============================
// DISPLAY CART
// =============================

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");


if (cartItems) {

    displayCart();

}


function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = "<h2>Your cart is empty</h2>";

        if (cartTotal) {
            cartTotal.innerText = "₹0";
        }

        return;
    }


    cart.forEach(function (product, index) {

        const price =
            Number(String(product.price).replace(/[₹,]/g, ""));

        total += price * product.quantity;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img src="${product.image}" alt="${product.name}">

                <div class="cart-item-info">

                    <h3>${product.name}</h3>

                    <p>${product.price}</p>


                    <div class="quantity">

                        <button onclick="decreaseQuantity(${index})">
                            −
                        </button>

                        <span>${product.quantity}</span>

                        <button onclick="increaseQuantity(${index})">
                            +
                        </button>

                    </div>


                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${index})">
                        Remove
                    </button>

                </div>

            </div>

        `;

    });


    if (cartTotal) {
        cartTotal.innerText =
            "₹" + total.toLocaleString("en-IN");
    }

}


// =============================
// INCREASE QUANTITY
// =============================

function increaseQuantity(index) {

    if (cart[index]) {

        cart[index].quantity++;

        saveCart();

    }

}


// =============================
// DECREASE QUANTITY
// =============================

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart();

}


// =============================
// REMOVE PRODUCT
// =============================

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

}


// =============================
// SAVE CART
// =============================

function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

    if (cartItems) {
        displayCart();
    }

}


// =============================
// PRODUCT DETAILS DATA
// =============================

const productData = {

    tshirt: {
        id: 1,
        name: "Stylish T-Shirt",
        price: "₹499",
        description: "Comfortable cotton T-Shirt for everyday use.",
        image: "image/tshirt.jpg"
    },

    headphones: {
        id: 2,
        name: "Wireless Headphones",
        price: "₹1,499",
        description: "High quality wireless headphones with clear sound.",
        image: "image/headphones.jpg"
    },

    chair: {
        id: 3,
        name: "Office Chair",
        price: "₹2,999",
        description: "Comfortable chair for office and study.",
        image: "image/chair.jpg"
    },

    shoes: {
        id: 4,
        name: "Running Shoes",
        price: "₹1,999",
        description: "Lightweight and comfortable running shoes.",
        image: "image/shoes.jpg"
    },

    smartwatch: {
        id: 5,
        name: "Smart Watch",
        price: "₹2,499",
        description: "Stylish smart watch with fitness and health tracking features.",
        image: "image/smartwatch.jpg"
    },

    backpack: {
        id: 6,
        name: "Laptop Backpack",
        price: "₹1,299",
        description: "Durable and spacious backpack for laptop and daily use.",
        image: "image/backpack.jpg"
    },

    sunglasses: {
        id: 7,
        name: "Sunglasses",
        price: "₹799",
        description: "Trendy sunglasses with comfortable lightweight design.",
        image: "image/sunglasses.jpg"
    },

    keyboard: {
        id: 8,
        name: "Mechanical Keyboard",
        price: "₹1,899",
        description: "Responsive mechanical keyboard for gaming and work.",
        image: "image/keyboard.jpg"
    }

};   


// =============================
// GET PRODUCT FROM URL
// =============================

const urlParams =
    new URLSearchParams(window.location.search);

const productKey =
    urlParams.get("product");


// =============================
// SHOW PRODUCT DETAILS
// =============================

if (productKey && productData[productKey]) {

    const product =
        productData[productKey];


    const detailsName =
        document.getElementById("details-name");

    const detailsPrice =
        document.getElementById("details-price");

    const detailsDescription =
        document.getElementById("details-description");

    const detailsImage =
        document.getElementById("details-image");


    if (detailsName) {
        detailsName.innerText = product.name;
    }


    if (detailsPrice) {
        detailsPrice.innerText = product.price;
    }


    if (detailsDescription) {
        detailsDescription.innerText =
            product.description;
    }


    if (detailsImage) {
        detailsImage.src = product.image;
        detailsImage.alt = product.name;
    }

}


// =============================
// PRODUCT DETAILS - ADD TO CART
// =============================

const detailsCartButton =
    document.getElementById("details-cart");


if (
    detailsCartButton &&
    productKey &&
    productData[productKey]
) {

    detailsCartButton.addEventListener("click", function () {

        const product =
            productData[productKey];


        const existingProduct =
            cart.find(function (item) {
                return item.product_id === product.id;
            });


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                product_id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });

        }


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        alert(product.name + " added to cart!");


        window.location.href = "cart.html";

    });

}


// =============================
// PROCEED TO CHECKOUT
// =============================

const checkoutButton =
    document.getElementById("checkout-btn");


if (checkoutButton) {

    checkoutButton.addEventListener("click", function () {

        const isLoggedIn =
            localStorage.getItem("loggedIn") === "true";


        // Login check
        if (!isLoggedIn) {

            alert("Please login first!");

            window.location.href = "login.html";

            return;
        }


        // Cart check
        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;
        }


        // Go to checkout
        window.location.href = "checkout.html";

    });

}


// =============================
// PLACE ORDER - BACKEND API
// =============================

const checkoutForm =
    document.getElementById("checkout-form");


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Check cart
            if (cart.length === 0) {

                alert("Your cart is empty!");

                return;
            }


            // Get logged-in user
            const currentUser =
                JSON.parse(
                    localStorage.getItem("currentUser")
                );


            if (!currentUser) {

                alert("Please login first!");

                window.location.href = "login.html";

                return;
            }


            // Get checkout information
            const name =
                document.getElementById("name").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const address =
                document.getElementById("address").value.trim();

            const city =
                document.getElementById("city").value.trim();

            const pincode =
                document.getElementById("pincode").value.trim();

            const payment =
                document.getElementById("payment").value;


            // Convert cart into order items
            const items =
                cart.map(function (product) {

                    return {
                        product_id: product.product_id,
                        quantity: product.quantity
                    };

                });


            // Check product IDs
            const invalidProduct =
                items.some(function (item) {

                    return !item.product_id;

                });


            if (invalidProduct) {

                alert(
                    "Cart products are missing product IDs. Please clear your cart and add the products again."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/orders",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({

                                user_id: currentUser.id,

                                name: name,

                                phone: phone,

                                address: address,

                                city: city,

                                pincode: pincode,

                                payment_method: payment,

                                items: items

                            })
                        }
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    alert(
                        "Order placed successfully! 🎉\nOrder ID: " +
                        data.orderId
                    );


                    // Clear cart
                    localStorage.removeItem("cart");


                    // Go to home page
                    window.location.href = "index.html";

                } else {

                    alert(
                        data.message ||
                        "Order failed!"
                    );

                }


            } catch (error) {

                console.error(
                    "Order Error:",
                    error
                );

                alert(
                    "Backend server se connection nahi ho raha!"
                );

            }

        }
    );

}


// =============================
// REGISTER - BACKEND API
// =============================

const registerForm =
    document.getElementById("register-form");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const name =
                document.getElementById("register-name").value.trim();

            const email =
                document.getElementById("register-email").value.trim();

            const password =
                document.getElementById("register-password").value;

            const confirmPassword =
                document.getElementById("confirm-password").value;


            // Check password
            if (password !== confirmPassword) {

                alert("Passwords do not match!");

                return;
            }


            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password

                            })
                        }
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    alert(
                        "Registration successful!"
                    );


                    // Login page par bhejo
                    window.location.href =
                        "login.html";

                } else {

                    alert(
                        data.message ||
                        "Registration failed!"
                    );

                }


            } catch (error) {

                console.error(error);

                alert(
                    "Backend server se connection nahi ho raha!"
                );

            }

        }
    );

}


// =============================
// LOGIN STATUS
// =============================

const loginRegisterLinks =
    document.getElementById(
        "login-register-links"
    );


const logoutBtn =
    document.getElementById("logout-btn");


const isLoggedIn =
    localStorage.getItem("loggedIn") === "true";


// If user is logged in
if (isLoggedIn) {

    if (loginRegisterLinks) {

        loginRegisterLinks.style.display =
            "none";

    }


    if (logoutBtn) {

        logoutBtn.style.display =
            "block";

    }

}


// If user is NOT logged in
else {

    if (loginRegisterLinks) {

        loginRegisterLinks.style.display =
            "flex";

    }


    if (logoutBtn) {

        logoutBtn.style.display =
            "none";

    }

}


// =============================
// LOGIN - BACKEND API
// =============================

const loginForm =
    document.getElementById("login-form");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const email =
                document.getElementById(
                    "login-email"
                ).value.trim();


            const password =
                document.getElementById(
                    "login-password"
                ).value;


            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: email,

                                password: password

                            })
                        }
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    localStorage.setItem(
                        "loggedIn",
                        "true"
                    );


                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(data.user)
                    );


                    alert(
                        "Login successful!"
                    );


                    window.location.href =
                        "index.html";

                } else {

                    alert(
                        data.message ||
                        "Login failed!"
                    );

                }


            } catch (error) {

                console.error(error);

                alert(
                    "Backend server se connection nahi ho raha!"
                );

            }

        }
    );

}


// =============================
// LOGOUT
// =============================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "loggedIn"
            );

            localStorage.removeItem(
                "currentUser"
            );


            alert(
                "Logout successful!"
            );


            window.location.href =
                "index.html";

        }
    );

}


// =============================
// CHECKOUT PAGE PROTECTION
// =============================

if (
    window.location.pathname.includes(
        "checkout.html"
    )
) {

    const checkoutLoggedIn =
        localStorage.getItem(
            "loggedIn"
        ) === "true";


    if (!checkoutLoggedIn) {

        alert(
            "Please login first!"
        );


        window.location.href =
            "login.html";

    }

}

// =============================
// LOAD USER ORDERS
// =============================

const ordersList = document.getElementById("orders-list");

if (ordersList) {

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {

        ordersList.innerHTML = `
            <p>Please login first.</p>
            <a href="login.html">Login</a>
        `;

    } else {

        loadOrders(currentUser.id);

    }
}


// =============================
// LOAD ORDERS FROM BACKEND
// =============================

async function loadOrders(userId) {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/orders/${userId}`
            );

        const orders = await response.json();


        if (!response.ok) {

            throw new Error(
                orders.message || "Failed to load orders"
            );

        }


        if (orders.length === 0) {

            ordersList.innerHTML = `
                <p>You have no orders yet.</p>
            `;

            return;
        }


        ordersList.innerHTML = "";


        orders.forEach(order => {

            const orderDiv =
                document.createElement("div");

            orderDiv.className = "order-card";


            // Product HTML

            let productsHTML = "";


            order.items.forEach(item => {

                // Find product from productData

                const product =
                    Object.values(productData).find(
                        p => Number(p.id) === Number(item.product_id)
                    );


                if (product) {

                    productsHTML += `
                        <div class="order-product">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                                class="order-product-image"
                            >

                            <div class="order-product-info">

                                <h3>
                                    ${product.name}
                                </h3>

                                <p>
                                    Price: ${product.price}
                                </p>

                                <p>
                                    Quantity: ${item.quantity}
                                </p>

                            </div>

                        </div>
                    `;

                } else {

                    productsHTML += `
                        <div class="order-product">
                            <p>
                                Product ID:
                                ${item.product_id}
                            </p>
                        </div>
                    `;

                }

            });


            orderDiv.innerHTML = `

                <h3>
                    Order #${order.id}
                </h3>

                <p>
                    <strong>Date:</strong>
                    ${order.created_at}
                </p>

                <p>
                    <strong>Total:</strong>
                    ₹${order.total}
                </p>

                <p>
                    <strong>Payment:</strong>
                    ${order.payment_method}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${order.address},
                    ${order.city} -
                    ${order.pincode}
                </p>


                <h4>
                    Products
                </h4>


                <div class="order-products">

                    ${productsHTML}

                </div>

            `;


            ordersList.appendChild(orderDiv);

        });


    } catch (error) {

        console.error(
            "Order History Error:",
            error
        );

        ordersList.innerHTML = `
            <p>
                Failed to load orders.
                Please make sure the backend server is running.
            </p>
        `;

    }

}