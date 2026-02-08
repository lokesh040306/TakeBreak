// backend/src/modules/messages/message.service.js

import Message from "../../models/Message.model.js";

/**
 * Save a message to the database
 *
 * IMPORTANT:
 * - NEVER throws
 * - Socket handlers depend on this guarantee
 */
export const saveMessage = async (data) => {
  try {
    return await Message.create({
      roomId: data.roomId,
      sender: data.sender,
      content: data.content,
      type: data.type || "text",
      fileMeta: data.fileMeta || null,
      isSystem: data.isSystem || false,
    });
  } catch (error) {
    console.error("❌ Failed to save message:", error.message);
    return null;
  }
};

/**
 * Create and save a system-generated message
 */
export const createSystemMessage = async (roomId, content) => {
  return saveMessage({
    roomId,
    sender: "SYSTEM",
    content,
    isSystem: true,
  });
};
