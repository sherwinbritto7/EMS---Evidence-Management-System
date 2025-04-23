const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.log("Connection Error:", err.message);
    process.exit(1);
  });
