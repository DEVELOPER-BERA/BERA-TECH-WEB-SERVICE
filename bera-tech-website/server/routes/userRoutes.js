const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authenticateToken = require("../auth"); // Import auth middleware
require("dotenv").config();

const router = express.Router();

// ✅ User Registration (Sign Up)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Error registering user" });
        res.json({ message: "User registered successfully" });
      }
    );
  });
});

// ✅ User Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (result.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  });
});

// ✅ Protected Dashboard Route (Only Authenticated Users Can Access)
router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to the dashboard!", user: req.user });
});

module.exports = router;
