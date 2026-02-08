import express from "express";
import { upload } from "../../middlewares/upload.middleware.js";
import { uploadFile } from "./upload.controller.js";

const router = express.Router();

router.post("/file", upload.single("file"), uploadFile);

export default router;
