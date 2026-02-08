// src/sockets/room.socket.js

import { findRoomById } from "../modules/rooms/room.service.js";
import { SOCKET_EVENTS } from "../utils/constants.js";

const roomOwners = new Map();

const registerRoomSocket = (io, socket) => {
  const emitMemberCount = (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const count = room ? room.size : 0;

    io.to(roomId).emit("room:members:update", { count });
  };

  const getMembers = (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) return [];

    return [...room]
      .map((socketId) => {
        const s = io.sockets.sockets.get(socketId);
        if (!s) return null;
        return { socketId, username: s.data.username };
      })
      .filter(Boolean);
  };

  socket.on(SOCKET_EVENTS.ROOM_JOIN, async ({ roomId, username }) => {
    if (!roomId || !username) return;

    try {
      // Validate room before joining
      const room = await findRoomById(roomId);

      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.username = username;

      if (!roomOwners.has(roomId)) {
        roomOwners.set(roomId, socket.id);
        socket.emit("room:owner", { isOwner: true });
      } else {
        socket.emit("room:owner", { isOwner: false });
      }

      socket.emit("room:members:list", getMembers(roomId));
      socket.emit("room:joined", { expiresAt: room.expiresAt });

      socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, {
        username,
        socketId: socket.id,
      });

      emitMemberCount(roomId);
    } catch (err) {
      console.error("❌ room join failed:", err);
      socket.emit("room:error", { message: err.message });
    }
  });

  socket.on("room:kick:user", ({ targetSocketId }) => {
    const { roomId } = socket.data;
    if (!roomId) return;

    if (roomOwners.get(roomId) !== socket.id) return;

    const target = io.sockets.sockets.get(targetSocketId);
    if (!target || target.data.roomId !== roomId) return;

    target.leave(roomId);

    // Owner edge case
    if (roomOwners.get(roomId) === target.id) {
      roomOwners.delete(roomId);
    }

    target.emit("room:kicked", {
      message: "You were kicked by the room owner",
    });

    socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
      username: target.data.username,
      socketId: target.id,
    });

    emitMemberCount(roomId);
  });

  socket.on("room:password:request", async () => {
    const { roomId } = socket.data;
    if (!roomId) return;

    if (roomOwners.get(roomId) !== socket.id) return;

    try {
      const room = await findRoomById(roomId);
      socket.emit("room:password:response", {
        password: room.password,
      });
    } catch (err) {
      console.error("❌ password fetch failed:", err);
    }
  });

  socket.on("disconnect", () => {
    const { roomId, username } = socket.data;
    if (!roomId) return;

    const wasOwner = roomOwners.get(roomId) === socket.id;

    socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
      username,
      socketId: socket.id,
    });

    if (wasOwner) {
      const members = getMembers(roomId);

      if (members.length > 0) {
        roomOwners.set(roomId, members[0].socketId);
        io.to(members[0].socketId).emit("room:owner", {
          isOwner: true,
        });
      } else {
        roomOwners.delete(roomId);
      }
    }

    emitMemberCount(roomId);
  });
};

export default registerRoomSocket;
