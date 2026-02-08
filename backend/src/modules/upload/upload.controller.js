import cloudinary from "../../config/cloudinary.js";
import { saveMessage } from "../messages/message.service.js";
import { getIO } from "../../sockets/socketManager.js";

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { roomId, username } = req.body;
    if (!roomId || !username) {
      return res.status(400).json({ message: "Invalid upload data" });
    }

    let resourceType = "raw";
    if (req.file.mimetype.startsWith("image/")) resourceType = "image";
    else if (req.file.mimetype.startsWith("video/")) resourceType = "video";

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `chat/${roomId}`,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    const type =
      uploadResult.resource_type === "image"
        ? "image"
        : uploadResult.resource_type === "video"
        ? "video"
        : "file";

    const messagePayload = {
      roomId,
      sender: username,
      content: uploadResult.secure_url,
      type,
      fileMeta: {
        name: req.file.originalname,
        size: req.file.size,
        mime: req.file.mimetype,
      },
    };

    const savedMessage = await saveMessage(messagePayload);

    // 🔥 best-effort socket emit
    try {
      const io = getIO();
      io.to(roomId).emit("message:receive", savedMessage);
    } catch {
      // socket not ready — ignore
    }

    res.status(201).json(savedMessage);
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err.message);
    next(new Error("File upload failed"));
  }
};
