// backend/src/sockets/index.js

import registerRoomSocket from "./room.socket.js";
import registerChatSocket from "./chat.socket.js";
import registerPresenceSocket from "./presence.socket.js";

const registerSocketHandlers = (io) => {
  if (!io) {
    throw new Error("Socket.IO instance is required to register socket handlers");
  }

  io.on("connection", (socket) => {
    console.log("🟢 connected:", socket.id);

    try {
      registerRoomSocket(io, socket);
      registerChatSocket(io, socket);
      registerPresenceSocket(io, socket); // MUST stay here
    } catch (error) {
      console.error(
        `❌ Error registering socket handlers for ${socket.id}:`,
        error
      );
    }

    socket.on("disconnect", (reason) => {
      console.log("🔴 disconnected:", socket.id, "| reason:", reason);
    });
  });
};

export default registerSocketHandlers;
