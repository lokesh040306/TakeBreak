import { Router } from "express";

import authRoutes from "./modules/auth/auth.routes.js";
import roomRoutes from "./modules/rooms/room.routes.js";
import messageRoutes from "./modules/messages/message.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/rooms", roomRoutes);
router.use("/messages", messageRoutes);
router.use("/ai", aiRoutes);

export default router;
