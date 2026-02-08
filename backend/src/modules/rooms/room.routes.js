import express from "express";
import {
  createRoomController,
  joinRoomController,
} from "./room.controller.js";

const router = express.Router();

router.post("/create", createRoomController);
router.post("/join", joinRoomController);

export default router;
