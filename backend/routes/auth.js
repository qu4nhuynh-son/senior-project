const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

// API Đăng Ký
router.post("/signup", async (req, res) => {
  try {
    console.log("📌 Signup request received:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      console.log("❌ Email already exists:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Hashed password:", hashedPassword);

    user = new User({ name, email, password: hashedPassword });

    await user.save();
    console.log("✅ User Created:", user);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "Error creating account", error });
  }
});




// API Đăng Nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
});

module.exports = router;
