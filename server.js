const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;
const JWT_SECRET = "your-secret-key";

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.use(cors());
app.use(bodyParser.json());

// Register
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("All fields are required");

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send("User created successfully");
    } catch (err) {
        res.status(500).send("Error registering user");
    }
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send("User not found");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(403).send("Invalid password");

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
});

// Validate Token
app.get("/validate-token", (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).send("Unauthorized");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).send("Token is valid");
    } catch (err) {
        res.status(401).send("Invalid token");
    }
});

// Middleware to validate JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).send("Access denied");

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).send("Invalid token");
    }
};

// Cart endpoint
app.post("/cart", authenticateToken, (req, res) => {
    const { productId, productName, selectedColor, selectedSize, quantity } = req.body;

    // You can extend this to save cart data to the database
    console.log("Cart Item:", { productId, productName, selectedColor, selectedSize, quantity });

    res.status(200).send("Item added to cart");
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
