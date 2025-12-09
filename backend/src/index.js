// backend/src/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import salesRoutes from "./routes/salesRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/sales", salesRoutes);

// Port (Render will inject PORT, otherwise fall back to 4000)
const PORT = process.env.PORT || 4000;

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI env variable is NOT set");
  process.exit(1);
}

// Optional, to avoid some warnings
mongoose.set("strictQuery", false);

// Connect to MongoDB and start server only after success
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // 10s timeout for Render
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // don’t keep running if DB is dead
  });
