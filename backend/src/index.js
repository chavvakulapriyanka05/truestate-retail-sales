// backend/src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import salesRoutes from "./routes/salesRoutes.js";

dotenv.config();

const app = express();

// ✅ Allow frontend (Vercel) + local dev
const allowedOrigins = [
  "http://localhost:5173",
  "https://truestate-retail-sales.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // allow mobile apps / curl (no origin) and our known origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

// API routes
app.use("/api", salesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
