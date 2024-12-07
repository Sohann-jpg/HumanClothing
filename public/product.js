const products = [
    { id: 1, name: "Jeans", category: "pants", price: 20, image: "images/Jeans.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultrices volutpat tempus.", colors: ["Red", "Blue", "Black"], sizes: ["36", "38", "40", "42", "44"], inventory: 50 },
    { id: 2, name: "Beanie", category: "accessories", price: 30, image: "images/Beanie.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultrices volutpat tempus.", colors: ["Red", "Blue", "Black"], sizes: ["36", "38", "40", "42", "44"], inventory: 50 },
    { id: 3, name: "Chinos", category: "pants", price: 40, image: "images/Chinos.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultrices volutpat tempus.", colors: ["Red", "Blue", "Black"], sizes: ["36", "38", "40", "42", "44"], inventory: 50 },
    { id: 4, name: "Nike Dunks", category: "shoes", price: 60, image: "images/Nike-Dunk.png", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultrices volutpat tempus.", colors: ["Red", "Blue", "Black"], sizes: ["36", "38", "40", "42", "44"], inventory: 50 },
    { id: 5, name: "Corduroy pants", category: "pants", price: 40, image: "images/Corduroy-pants.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultrices volutpat tempus.", colors: ["Red", "Blue", "Black"], sizes: ["36", "38", "40", "42", "44"], inventory: 50 },
    { id: 6, name: "Round neck sweater", category: "hoodies", price: 40, image: "images/round-neck-sweater.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultrices volutpat tempus.", colors: ["Red", "Blue", "Black"], sizes: ["36", "38", "40", "42", "44"], inventory: 50 },
    { id: 7, name: "Knitted Cardigan", category: "hoodies", price: 40, image: "images/knitted-cardigan.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultrices volutpat tempus.", colors: ["Red", "Blue", "Black"], sizes: ["36", "38", "40", "42", "44"], inventory: 50 },
    { id: 8, name: "Hooded sweater", category: "hoodies", price: 40, image: "images/hooded-sweater.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultrices volutpat tempus.", colors: ["Red", "Blue", "Black"], sizes: ["36", "38", "40", "42", "44"], inventory: 50 },
    { id: 9, name: "Timberland boots", category: "shoes", price: 40, image: "images/timberland-boots.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultrices volutpat tempus.", colors: ["Red", "Blue", "Black"], sizes: ["36", "38", "40", "42", "44"], inventory: 50 },
    { id: 10, name: "Classic Sneakers", category: "shoes", price: 40, image: "images/Classic-Sneakers.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultrices volutpat tempus.", colors: ["Red", "Blue", "Black"], sizes: ["36", "38", "40", "42", "44"], inventory: 50 }
];

// Parse the product ID from the URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));
const product = products.find(p => p.id === productId);

const productDetails = document.getElementById("product-details");

if (product) {
    productDetails.innerHTML = `
        <div class="product-container">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h2>${product.name}</h2>
                <p class="price">Price: $${product.price}</p>
                <p>${product.description}</p>
                <div class="product-options">
                    <div class="option">
                        <h4>Color</h4>
                        ${product.colors
                            .map(
                                (color, index) =>
                                    `<label>
                                        <input type="radio" name="color" value="${color}" ${
                                        index === 0 ? "checked" : ""
                                    }>
                                        ${color}
                                    </label>`
                            )
                            .join("")}
                    </div>
                    <div class="option">
                        <h4>Size</h4>
                        ${product.sizes
                            .map(
                                (size, index) =>
                                    `<label>
                                        <input type="radio" name="size" value="${size}" ${
                                        index === 0 ? "checked" : ""
                                    }>
                                        ${size}
                                    </label>`
                            )
                            .join("")}
                    </div>
                    <div class="option">
                        <h4>Quantity</h4>
                        <div class="quantity-selector">
                            <button id="decrement">-</button>
                            <input type="number" id="quantity" value="1" min="1" max="${product.inventory}">
                            <button id="increment">+</button>
                        </div>
                        <p>Available Inventory: ${product.inventory}</p>
                    </div>
                </div>
                <button id="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `;

    const decrementButton = document.getElementById("decrement");
    const incrementButton = document.getElementById("increment");
    const quantityInput = document.getElementById("quantity");

    decrementButton.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    incrementButton.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < product.inventory) {
            quantityInput.value = currentValue + 1;
        }
    });

    const addToCartButton = document.getElementById("add-to-cart");

    // Function to display notifications
    function showNotification(message, type = "error") {
        console.log(`Notification triggered: ${message}, Type: ${type}`); // Debug log
        const notification = document.getElementById("notification");

        // Add message and notification type
        notification.textContent = message;
        notification.className = `show ${type}`;

        // Auto-hide the notification after 3 seconds
        setTimeout(() => {
            notification.className = "hidden";
        }, 3000);
    }

    // Handle Add to Cart logic
    addToCartButton.addEventListener("click", async () => {
        console.log("Add to cart button clicked"); // Debug log
        const token = localStorage.getItem("token");
        if (!token) {
            showNotification("You need to log in to add items to the cart.", "error");
            return;
        }

        const selectedColor = document.querySelector('input[name="color"]:checked').value;
        const selectedSize = document.querySelector('input[name="size"]:checked').value;
        const quantity = parseInt(quantityInput.value);

        const cartItem = {
            productId: product.id,
            productName: product.name,
            selectedColor,
            selectedSize,
            quantity,
        };

        try {
            const response = await fetch("http://localhost:5000/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(cartItem),
            });

            if (response.ok) {
                showNotification("Item added to cart successfully!", "success");
            } else {
                showNotification("Failed to add item to cart.", "error");
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
            showNotification("Something went wrong. Please try again.", "error");
        }
    });
} else {
    productDetails.innerHTML = "<p>Product not found!</p>";
}