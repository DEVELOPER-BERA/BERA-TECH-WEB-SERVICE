const express = require("express");
const jwt = require("jsonwebtoken");
const { generateToken, hashPassword, comparePassword } = require("../auth");
const db = require("../db");

const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await hashPassword(password);
        await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

        res.json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
});

// ✅ Login User
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: "Invalid credentials" });

        const token = generateToken(user);
        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
});

// ✅ Middleware to Protect Routes
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
};

// ✅ Protected Route (Dashboard Access)
router.get("/dashboard", verifyToken, (req, res) => {
    res.json({ message: `Welcome, User ${req.user.email}!` });
});

module.exports = router;
