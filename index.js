import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import databaseConncetion from "./db.js";
import { UserRouter } from "./controller/user.js";
import { IncomeRouter } from "./routes/income.js";
import { ExpenseRouter } from "./routes/expenses.js";

console.log("Loaded ENV Variables:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? "✅ Exists" : "❌ Missing",
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", UserRouter);
app.use("/income", IncomeRouter);
app.use("/expense", ExpenseRouter);

app.get("/test", (req, res) => {
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

databaseConncetion();

// ❌ No app.listen here
export default app;
