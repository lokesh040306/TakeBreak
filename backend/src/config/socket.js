// backend/src/config/socket.js
import { Server } from "socket.io";
import registerSocketHandlers from "../sockets/index.js";
import { setIO } from "../sockets/socketManager.js";

let ioInstance = null;

const initSocket = (server) => {
  if (ioInstance) {
    console.warn("⚠️ Socket.IO already initialized");
    return ioInstance;
  }

  try {
    const io = new Server(server, {
      cors: {
        origin: true, // allow dynamic origin (safe with credentials)
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    registerSocketHandlers(io);

    // Store IO globally ONLY after handlers are ready
    setIO(io);

    ioInstance = io;

    console.log("🔌 Socket.IO initialized successfully");

    return io;
  } catch (error) {
    console.error("❌ Socket.IO initialization failed:", error);
    throw error; // fail fast, server should not run
  }
};

export default initSocket;
