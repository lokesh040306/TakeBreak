// backend/src/models/Room.model.js

import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    durationInMinutes: {
      type: Number,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true, // useful for expiry checks
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true, // 🔥 important for timer queries
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Optional future improvement:
 * Enable TTL auto-cleanup AFTER expiry buffer
 * (disabled for now to keep behavior unchanged)
 *
 * roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
 */

export default mongoose.model("Room", roomSchema);
