import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import salesRoutes from "./routes/salesRoutes.js";
import { mapRawRowToSalesRecord } from "./models/salesRecord.js";
import { setSalesData } from "./services/salesService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/sales", salesRoutes);

const PORT = process.env.PORT || 4000;

function loadCsvData() {
  return new Promise((resolve, reject) => {
    const results = [];
    const dataFilePath =
      process.env.DATA_FILE_PATH ||
      path.join(__dirname, "..", "data", "sales_data.csv");

    fs.createReadStream(dataFilePath)
      .pipe(csv())
      .on("data", row => {
        results.push(mapRawRowToSalesRecord(row));
      })
      .on("end", () => {
        console.log(`Loaded ${results.length} records from CSV`);
        resolve(results);
      })
      .on("error", err => {
        reject(err);
      });
  });
}

async function startServer() {
  try {
    const data = await loadCsvData();
    setSalesData(data);

    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
