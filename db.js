import mongoose from "mongoose";

const databaseConncetion = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database is connected");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

export default databaseConncetion;
