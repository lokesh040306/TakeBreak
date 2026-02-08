// backend/src/models/Message.model.js

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },

    sender: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },

    content: {
      type: String,
      required: true,
    },

    fileMeta: {
      name: String,
      size: Number,
      mime: String,
    },

    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * 🔥 Compound index for fast chat history queries
 * Used by:
 * - Message.find({ roomId }).sort({ createdAt })
 */
messageSchema.index({ roomId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
