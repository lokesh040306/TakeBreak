// backend/src/modules/ai/ai.memory.js

/**
 * In-memory AI conversation memory per room
 *
 * Key   → roomId
 * Value → [{ role, content }]
 *
 * Design guarantees:
 * - Room-isolated memory
 * - Bounded size (prevents token explosion)
 * - Safe to call from sockets & services
 */

const aiMemory = new Map();
const MAX_MEMORY_LENGTH = 20;

export const getRoomMemory = (roomId) => {
  if (!roomId) return [];

  if (!aiMemory.has(roomId)) {
    aiMemory.set(roomId, []);
  }

  return aiMemory.get(roomId);
};

export const addToRoomMemory = (roomId, role, content) => {
  if (!roomId || !role || !content) return;

  const memory = getRoomMemory(roomId);

  memory.push({ role, content });

  // Keep memory bounded
  if (memory.length > MAX_MEMORY_LENGTH) {
    memory.splice(0, memory.length - MAX_MEMORY_LENGTH);
  }
};

export const clearRoomMemory = (roomId) => {
  if (!roomId) return;
  aiMemory.delete(roomId);
};

/**
 * Optional utility (for debugging / admin tools later)
 */
export const getMemoryStats = () => {
  return {
    rooms: aiMemory.size,
  };
};
