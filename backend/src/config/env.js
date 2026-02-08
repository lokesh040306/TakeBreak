// backend/src/config/env.js

import dotenv from "dotenv";

dotenv.config();

const getEnv = (key, defaultValue = undefined) => {
  const value = process.env[key];

  if (value === undefined && defaultValue === undefined) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }

  return value ?? defaultValue;
};

const env = {
  // Server
  PORT: Number(getEnv("PORT", 5000)),
  NODE_ENV: getEnv("NODE_ENV", "development").toLowerCase(),

  // Database
  MONGO_URI: getEnv("MONGO_URI"),

  // Client / CORS
  CLIENT_URL: getEnv("CLIENT_URL", "http://localhost:5173"),
  SOCKET_CORS_ORIGIN: getEnv(
    "SOCKET_CORS_ORIGIN",
    "http://localhost:5173"
  ),

  // Cloudinary (required for uploads)
  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),

  // AI (Groq)
  GROQ_API_KEY: getEnv("GROQ_API_KEY"),

  HF_API_KEY: getEnv("HF_API_KEY")
};

export default env;
