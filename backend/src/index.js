import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import salesRoutes from "./routes/salesRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("Database Error ❌", err));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/sales", salesRoutes);

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
