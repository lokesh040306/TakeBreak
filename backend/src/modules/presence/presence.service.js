// backend/src/modules/presence/presence.service.js

const rooms = new Map();

const ensureRoom = (roomId) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map());
  }
  return rooms.get(roomId);
};

const resolveUniqueUsername = (room, username) => {
  const names = Array.from(room.values());
  if (!names.includes(username)) return username;

  let i = 2;
  while (names.includes(`${username}_${i}`)) i++;
  return `${username}_${i}`;
};

export const addMember = (roomId, socketId, username) => {
  const room = ensureRoom(roomId);
  const uniqueName = resolveUniqueUsername(room, username);
  room.set(socketId, uniqueName);
  return getMembers(roomId);
};

export const removeMember = (roomId, socketId) => {
  const room = rooms.get(roomId);
  if (!room) return [];

  room.delete(socketId);
  if (room.size === 0) rooms.delete(roomId);
  return getMembers(roomId);
};

export const getMembers = (roomId) => {
  const room = rooms.get(roomId);
  if (!room) return [];

  return Array.from(room.entries()).map(([socketId, name]) => ({
    socketId,
    name,
  }));
};
