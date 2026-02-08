// backend/src/modules/messages/timer.service.js

import Room from "../../models/Room.model.js";
import { isRoomExpired } from "../../utils/timeUtils.js";
import { SOCKET_EVENTS } from "../../utils/constants.js";
import { getIO } from "../../sockets/socketManager.js";
import { clearRoomMemory } from "../ai/ai.memory.js";

const startRoomExpiryWatcher = () => {
  setInterval(async () => {
    try {
      const activeRooms = await Room.find({ isActive: true });

      for (const room of activeRooms) {
        if (isRoomExpired(room.expiresAt)) {
          room.isActive = false;
          await room.save();

          // 🔥 CLEAR AI MEMORY (IMPORTANT)
          clearRoomMemory(room.roomId);

          try {
            const io = getIO();
            io.to(room.roomId).emit(SOCKET_EVENTS.ROOM_EXPIRED, {
              roomId: room.roomId,
              message: "Room time has expired",
            });
          } catch {
            // Socket not initialized yet — safe to ignore
          }
        }
      }
    } catch (error) {
      console.error("❌ Room expiry watcher error:", error.message);
    }
  }, 30 * 1000);
};

export default startRoomExpiryWatcher;
