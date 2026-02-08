// backend/src/config/db.js

import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV !== "production", // faster prod startup
      serverSelectionTimeoutMS: 5000,
    });

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 MongoDB connection closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
