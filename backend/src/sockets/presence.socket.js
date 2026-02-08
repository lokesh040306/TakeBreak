// backend/src/sockets/presence.socket.js

import * as presenceService from "../modules/presence/presence.service.js";

const registerPresenceSocket = (io, socket) => {
  let roomId = null;

  socket.on("presence:join", ({ roomId: rId, username }) => {
    if (!rId || !username) return;
    if (roomId) return; // prevent double join

    roomId = rId;

    socket.join(roomId);

    const members = presenceService.addMember(
      roomId,
      socket.id,
      username
    );

    io.to(roomId).emit("members:update", {
      members,
      count: members.length,
    });
  });

  socket.on("disconnect", () => {
    if (!roomId) return;

    const members = presenceService.removeMember(
      roomId,
      socket.id
    );

    io.to(roomId).emit("members:update", {
      members,
      count: members.length,
    });
  });
};

export default registerPresenceSocket;
