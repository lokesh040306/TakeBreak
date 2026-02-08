// src/app.js
import express from "express";
import cors from "cors";

import roomRoutes from "./modules/rooms/room.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";

import errorMiddleware from "./middlewares/error.middleware.js";
import apiRateLimiter from "./middlewares/rateLimit.middleware.js";

const app = express();

/* -------------------- MIDDLEWARES -------------------- */

app.use(
  cors({
    origin: "https://takebreak-2.onrender.com",
    credentials: true,
  })
);

// Body parsers (limit prevents abuse)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Rate limiting only for APIs
app.use("/api", apiRateLimiter);

/* -------------------- HEALTH & META -------------------- */

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Anonymous Chat API is running 🚀",
  });
});

/* -------------------- ROUTES -------------------- */

app.use("/api/rooms", roomRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/ai", aiRoutes);

/* -------------------- GLOBAL ERROR HANDLER -------------------- */

app.use(errorMiddleware);

export default app;
