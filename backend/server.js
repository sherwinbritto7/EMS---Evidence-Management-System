import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/authRoutes.js";
import { evidenceRoutes } from "./routes/evidenceRoutes.js";

import adminRoutes from "./routes/adminRoutes.js"; // Add this import
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Mount all routes
app.use("/api/auth", authRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/admin", adminRoutes); // Add this line

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
