import multer from "multer";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

export const upload = multer({
  storage: multer.memoryStorage(), // ✅ RAM only
  limits: { fileSize: MAX_FILE_SIZE }, // ✅ safety
  fileFilter,
});
