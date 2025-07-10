require("dotenv").config();
const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// 📌 API ĐĂNG KÝ (SIGN UP)
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashPass = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashPass });

      await newUser.save();
      console.log("✅ User Created:", user);

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

      return res.status(201).json({
        message: "Sign-up successful",
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// 📌 API ĐĂNG NHẬP (LOG IN)
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

      res.status(200).json({
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        token,
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// 📌 API XÁC MINH EMAIL (VERIFY EMAIL)
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email } = decoded;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const newUser = new User({ name, email, password: "TEMP" }); // Password tạm để tránh lỗi
    await newUser.save();

    res.status(200).json({
      message: "Email verified successfully! Your account has been created.",
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});
// 📌 API LẤY HỒ SƠ USER (GET PROFILE)
router.get("/user/:id/profile", async (req, res) => {
  const userId = req.query.id;
  if (!userId) return res.status(400).json({ message: "User ID is required" });
  
  try {
    console.log("🔍 Fetching profile for user ID:", req.params.id);

    const user = await User.findById(req.params.id).select("-password"); // Không trả về mật khẩu
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ hasProfile: true, user });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 API CẬP NHẬT HỒ SƠ USER (UPDATE PROFILE)
router.post("/user/profile", async (req, res) => {
  try {
    const { id, name, useWithTeam } = req.body;
    if (!id) return res.status(400).json({ message: "User ID is required" });

    const user = await User.findByIdAndUpdate(
      id,
      { name, useWithTeam },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
