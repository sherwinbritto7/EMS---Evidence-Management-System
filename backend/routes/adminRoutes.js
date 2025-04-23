import express from "express";
import auth from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Create admin route
router.post("/create-admin", auth, adminAuth, async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      username,
      password: hashedPassword,
      role: "admin",
      isApproved: true,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin account" });
  }
});

// Get pending users route
router.get("/pending-users", auth, adminAuth, async (req, res) => {
  try {
    const pendingUsers = await User.find({
      isApproved: false,
      role: { $in: ["law_enforcement", "legal_personnel"] },
    });
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Approve/reject user route
router.put("/approve-user/:userId", auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.status === false) {
      await User.findByIdAndDelete(req.params.userId);
      return res.json({ message: "User rejected and deleted successfully" });
    }

    user.isApproved = true;
    await user.save();
    res.json({ message: "User approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users/count", auth, adminAuth, async (req, res) => {
  const total = await User.countDocuments();
  res.json({ total });
});

// Get all users route
router.get("/all-users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user route
router.delete("/users/:userId", auth, adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;
