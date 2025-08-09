import dotenv from "dotenv";
dotenv.config(); // Load .env before any imports that use env variables

import express from "express";
import databaseConncetion from "./db.js";
import cors from "cors";
import { UserRouter } from "./controller/user.js";
import { IncomeRouter } from "./routes/income.js";
import { ExpenseRouter } from "./routes/expenses.js";

// Debug: log env variable status
console.log("Loaded ENV Variables:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? "✅ Exists" : "❌ Missing",
});

const PORT = process.env.PORT || 5000;

const server = express();
server.use(cors());
server.use(express.json());

// Main API routes
server.use("/user", UserRouter);
server.use("/income", IncomeRouter);
server.use("/expense", ExpenseRouter);

// Test/debug route
server.get("/test", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running 🚀",
    env: {
      PORT: process.env.PORT || "default 5000",
      MONGO_URI: process.env.MONGO_URI ? "✅ Exists" : "❌ Missing",
    },
    timestamp: new Date().toISOString(),
  });
});

// Connect to DB
databaseConncetion();

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default server;
