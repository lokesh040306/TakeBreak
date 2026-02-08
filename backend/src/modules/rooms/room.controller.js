import {
  createRoom,
  findRoomById,
  validateRoomPassword,
} from "./room.service.js";

export const createRoomController = async (req, res, next) => {
  try {
    const { password, durationInMinutes } = req.body;

    if (!password || !durationInMinutes) {
      return res.status(400).json({
        success: false,
        message: "Password and duration are required",
      });
    }

    const room = await createRoom(password, durationInMinutes);

    res.status(201).json({
      success: true,
      data: {
        roomId: room.roomId,
        expiresAt: room.expiresAt,
        durationInMinutes: room.durationInMinutes,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const joinRoomController = async (req, res, next) => {
  try {
    const { roomId, password } = req.body;

    if (!roomId || !password) {
      return res.status(400).json({
        success: false,
        message: "Room ID and password are required",
      });
    }

    const room = await findRoomById(roomId);
    validateRoomPassword(room, password);

    res.status(200).json({
      success: true,
      data: {
        roomId: room.roomId,
        expiresAt: room.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
