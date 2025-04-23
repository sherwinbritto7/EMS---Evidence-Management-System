const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin account already exists!");
      process.exit(0);
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      username: "admin",
      password: hashedPassword,
      role: "admin",
      isApproved: true,
    });

    await admin.save();
    console.log("✅ Admin account created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
    process.exit(0);
  } catch (error) {
    console.log("Creation Error:", error.message);
    process.exit(1);
  }
};

createAdmin();
