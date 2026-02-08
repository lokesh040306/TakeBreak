// backend/src/middlewares/error.middleware.js

import multer from "multer";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Multer-specific errors cleanly
  if (err instanceof multer.MulterError) {
    statusCode = 400;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds allowed limit";
    } else {
      message = "File upload error";
    }
  }

  console.error("❌ Error:", {
    path: req.originalUrl,
    statusCode,
    message,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
