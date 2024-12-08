const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");  // Import path module for serving static files

const app = express();
const PORT = 5000;
const JWT_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTQ3YjViMDUzMzFlZGQyN2FjMDVkMyIsImlhdCI6MTczMzU4OTkyMiwiZXhwIjoxNzMzNTkzNTIyfQ.1wXRGaVuZHEsAJX9KjqMoUUvzVAgW6LY4X1q6T60NQI";

// Middleware to validate JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied" });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid token" });
    }
};
// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/userDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Default route for health check
app.get("/", (req, res) => {
    res.status(200).send("Server is running!");
});




// Register endpoint
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        if (err.code === 11000) {
            res.status(409).json({ error: "Username already exists" });
        } else {
            res.status(500).json({ error: "Error registering user" });
        }
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(403).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: "Error logging in" });
    }
});

// Validate token endpoint
app.get("/validate-token", (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        jwt.verify(token, JWT_SECRET);
        res.status(200).json({ message: "Token is valid" });
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
});



// Cart endpoint
app.post("/cart", authenticateToken, (req, res) => {
    const { productId, productName, selectedColor, selectedSize, quantity } = req.body;

    if (!productId || !productName || !selectedColor || !selectedSize || !quantity) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Log cart data (can extend to save to a database)
    console.log("Cart Item:", { productId, productName, selectedColor, selectedSize, quantity });

    res.status(200).json({ message: "Item added to cart" });
});





// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
