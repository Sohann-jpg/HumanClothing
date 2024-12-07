const products = [
    { id: 1, name: "Jeans", category: "pants", price: 20, image: "images/Jeans.jpg", },
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
const resultsMessage = document.createElement("div"); // Create a results message element
resultsMessage.className = "results-message";
document.querySelector(".filter-container").appendChild(resultsMessage); // Append it beside the filter menu

// Function to display products dynamically
function displayProducts(filter = "all", searchQuery = "") {
    productGrid.innerHTML = ""; // Clear the product grid

    const filteredProducts = products.filter(product => {
        const matchesFilter = filter === "all" || product.category === filter;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Update results message
    resultsMessage.textContent =
        filter === "all" && !searchQuery
            ? "Showing all results"
            : `Showing results for "${filter !== "all" ? filter : searchQuery}"`;

    // Display filtered products
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
        displayProducts(filter, searchQuery); // Filter and search
        filterMenu.classList.remove("active"); // Close dropdown after selection
    });
});

// Search bar event listener
searchBar.addEventListener("input", () => {
    const searchQuery = searchBar.value;
    const activeFilter = document.querySelector("[data-filter].active")?.getAttribute("data-filter") || "all";
    displayProducts(activeFilter, searchQuery); // Apply search
});

document.getElementById("login-btn").addEventListener("click", () => {
    document.getElementById("login-modal").style.display = "block";
});

document.getElementById("signup-btn").addEventListener("click", () => {
    document.getElementById("signup-modal").style.display = "block";
});

// Login
document.getElementById("submit-login").addEventListener("click", async () => {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            alert("Login successful");
            document.getElementById("login-modal").style.display = "none";
        } else {
            alert("Login failed");
        }
    } catch (err) {
        console.error(err);
    }
});

// Signup
document.getElementById("submit-signup").addEventListener("click", async () => {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert("User registered successfully");
            document.getElementById("signup-modal").style.display = "none";
        } else {
            alert("Signup failed");
        }
    } catch (err) {
        console.error(err);
    }
});

// Show the login modal
document.getElementById("login-btn").addEventListener("click", () => {
    document.getElementById("login-modal").style.display = "flex";
});

// Show the signup modal
document.getElementById("signup-btn").addEventListener("click", () => {
    document.getElementById("signup-modal").style.display = "flex";
});

// Handle closing modals when clicking outside the content
window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
});

// Handle Login Submission
document.getElementById("submit-login").addEventListener("click", async () => {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            alert("Login successful!");
            document.getElementById("login-modal").style.display = "none";
        } else {
            alert("Login failed!");
        }
    } catch (error) {
        console.error("Login error:", error);
    }
});

// Handle Signup Submission
document.getElementById("submit-signup").addEventListener("click", async () => {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert("User registered successfully!");
            document.getElementById("signup-modal").style.display = "none";
        } else {
            alert("Signup failed!");
        }
    } catch (error) {
        console.error("Signup error:", error);
    }
});

// Function to display notifications
function showNotification(message, type = "error") {
    const notification = document.getElementById("notification");

    // Add message and notification type
    notification.textContent = message;
    notification.className = `show ${type}`;

    // Auto-hide the notification after 3 seconds
    setTimeout(() => {
        notification.className = "hidden";
    }, 3000);
}

// Initial load
displayProducts();
