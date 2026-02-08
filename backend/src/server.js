// src/server.js
import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js";
import initSocket from "./config/socket.js";
import startRoomExpiryWatcher from "./modules/messages/timer.service.js";

/* -------------------- BOOTSTRAP SERVER -------------------- */

const PORT = env.PORT;

const server = http.createServer(app);

async function bootstrap() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Socket.IO
    initSocket(server);

    // Start background jobs ONLY after infra is ready
    startRoomExpiryWatcher();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server bootstrap failed:", error);
    process.exit(1);
  }
}

bootstrap();

/* -------------------- GRACEFUL SHUTDOWN -------------------- */

process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down...");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received. Shutting down...");
  server.close(() => process.exit(0));
});
