import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);
  const { username, password, role } = req.body;

  const user = await User.findOne({ username });
  console.log("User found:", user);

  try {
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify role
    if (user.role !== role) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if approved (except for admin)
    if (role !== "admin" && !user.isApproved) {
      return res.status(400).json({ message: "Account pending approval" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Signup Route
router.post("/signup", async (req, res) => {
  console.log("Signup request received:", req.body);
  const { username, password, role } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      username,
      password: hashedPassword,
      role,
      isApproved: role === "admin",
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify Token Route
router.get("/verify", async (req, res) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
});

export { router as authRoutes };
