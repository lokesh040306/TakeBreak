// backend/src/middlewares/rateLimit.middleware.js

import rateLimit from "express-rate-limit";

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  // Respect proxy headers (Render, Railway, Nginx)
  keyGenerator: (req) => {
    return (
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress
    );
  },

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

export default apiRateLimiter;
