import Room from "../../models/Room.model.js";
import generateRoomId from "../../utils/generateRoomId.js";
import { ROOM_DURATIONS } from "../../utils/constants.js";
import { calculateExpiryTime, isRoomExpired } from "../../utils/timeUtils.js";

/**
 * Create a new anonymous chat room
 */
export const createRoom = async (password, durationInMinutes) => {
  if (!ROOM_DURATIONS.includes(durationInMinutes)) {
    throw new Error("Invalid room duration selected");
  }

  const roomId = generateRoomId();
  const expiresAt = calculateExpiryTime(durationInMinutes);

  return Room.create({
    roomId,
    password,
    durationInMinutes,
    expiresAt,
    isActive: true,
  });
};

/**
 * Find an active room by roomId
 */
export const findRoomById = async (roomId) => {
  const room = await Room.findOne({ roomId });

  if (!room) {
    const err = new Error("Room not found");
    err.statusCode = 404;
    throw err;
  }

  if (!room.isActive || isRoomExpired(room.expiresAt)) {
    room.isActive = false;
    await room.save();

    const err = new Error("Room has expired");
    err.statusCode = 410; // Gone
    throw err;
  }

  return room;
};

/**
 * Validate room password
 */
export const validateRoomPassword = (room, password) => {
  if (room.password !== password) {
    const err = new Error("Invalid room password");
    err.statusCode = 401;
    throw err;
  }

  return true;
};

/**
 * Deactivate room manually
 */
export const deactivateRoom = async (roomId) => {
  return Room.findOneAndUpdate(
    { roomId },
    { isActive: false },
    { new: true }
  );
};
