const products = [
    { id: 1, name: "Jeans", category: "pants", price: 20, image: "images/Jeans.jpg" },
    { id: 2, name: "Beanie", category: "accessories", price: 30, image: "images/Beanie.jpg" },
    { id: 3, name: "Chinos", category: "pants", price: 40, image: "images/Chinos.jpg" },
    { id: 4, name: "Nike Dunks", category: "shoes", price: 60, image: "images/Nike-Dunk.png" },
    { id: 5, name: "Corduroy pants", category: "pants", price: 40, image: "images/Corduroy-pants.jpg" },
    { id: 6, name: "Round neck sweater", category: "hoodies", price: 40, image: "images/round-neck-sweater.jpg" },
    { id: 7, name: "Knitted Cardigan", category: "hoodies", price: 40, image: "images/knitted-cardigan.jpg" },
    { id: 8, name: "Hooded sweater", category: "hoodies", price: 40, image: "images/hooded-sweater.jpg" },
    { id: 9, name: "Timberland boots", category: "shoes", price: 40, image: "images/timberland-boots.jpg" },
    { id: 10, name: "Classic Sneakers", category: "shoes", price: 40, image: "images/Classic-Sneakers.jpg" }
];

const productGrid = document.getElementById("product-grid");
const searchBar = document.getElementById("search-bar");
const filterToggle = document.getElementById("filter-toggle");
const filterMenu = document.getElementById("filter-menu");
const resultsMessage = document.createElement("div");
resultsMessage.className = "results-message";
document.querySelector(".filter-container").appendChild(resultsMessage);

// Function to display products dynamically
function displayProducts(filter = "all", searchQuery = "") {
    productGrid.innerHTML = "";

    const filteredProducts = products.filter(product => {
        const matchesFilter = filter === "all" || product.category === filter;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    resultsMessage.textContent =
        filter === "all" && !searchQuery
            ? "Showing all results"
            : `Showing results for "${filter !== "all" ? filter : searchQuery}"`;

    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
            </a>
        `;
        productGrid.appendChild(productCard);
    });
}

// Automatically display all products on page load
window.onload = () => {
    const token = localStorage.getItem("token");
    displayProducts("all"); // Show all products on load

    // Update UI based on login state
    if (token) {
        document.getElementById("logout-button").style.display = "block";
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("signup-btn").style.display = "none";
    } else {
        document.getElementById("logout-button").style.display = "none";
        document.getElementById("login-btn").style.display = "block";
        document.getElementById("signup-btn").style.display = "block";
    }
};

// Toggle dropdown menu visibility
filterToggle.addEventListener("click", () => {
    filterMenu.classList.toggle("active");
});

// Add event listeners to dropdown filter buttons
const filterButtons = filterMenu.querySelectorAll("button");
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");
        const searchQuery = searchBar.value;
        displayProducts(filter, searchQuery);
        filterMenu.classList.remove("active");
    });
});

// Search bar event listener
searchBar.addEventListener("input", () => {
    const searchQuery = searchBar.value;
    const activeFilter = document.querySelector("[data-filter].active")?.getAttribute("data-filter") || "all";
    displayProducts(activeFilter, searchQuery);
});

// Login Modal
document.getElementById("login-btn").addEventListener("click", () => {
    document.getElementById("login-modal").style.display = "flex";
});

// Signup Modal
document.getElementById("signup-btn").addEventListener("click", () => {
    document.getElementById("signup-modal").style.display = "flex";
});

// Close Modals on Outside Click
window.addEventListener("click", event => {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
});

// Login Functionality
document.getElementById("submit-login").addEventListener("click", async () => {
    const username = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem("token", result.token);
            alert("Login successful!");
            document.getElementById("login-modal").style.display = "none";
            document.getElementById("logout-button").style.display = "block";
            document.getElementById("login-btn").style.display = "none";
            document.getElementById("signup-btn").style.display = "none";
        } else {
            const error = await response.json();
            alert(error.error);
        }
    } catch (err) {
        console.error("Login error:", err);
        alert("An error occurred. Please try again.");
    }
});

// Logout Functionality
document.getElementById("logout-button").addEventListener("click", () => {
    localStorage.removeItem("token");
    alert("Logged out successfully.");
    document.getElementById("logout-button").style.display = "none";
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("signup-btn").style.display = "block";
});

// Signup Functionality
document.getElementById("submit-signup").addEventListener("click", async () => {
    const username = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert("Signup successful!");
            document.getElementById("signup-modal").style.display = "none";
        } else {
            const error = await response.json();
            alert(error.error);
        }
    } catch (err) {
        console.error("Signup error:", err);
        alert("An error occurred. Please try again.");
    }
});

// Add to Cart Functionality
document.getElementById("add-to-cart").addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must log in to add items to the cart.");
        return;
    }

    const cartItem = {
        productId: 1,
        productName: "Example Product",
        selectedColor: "Red",
        selectedSize: "M",
        quantity: 2,
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
            alert("Item added to cart.");
        } else {
            const error = await response.json();
            alert(error.error);
        }
    } catch (err) {
        console.error("Add to cart error:", err);
        alert("An error occurred. Please try again.");
    }
});

// Notifications
function showNotification(message, type = "error") {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `show ${type}`;
    setTimeout(() => (notification.className = "hidden"), 3000);
}
