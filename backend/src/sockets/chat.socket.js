// src/sockets/chat.socket.js

import { SOCKET_EVENTS } from "../utils/constants.js";
import { saveMessage } from "../modules/messages/message.service.js";
import { askAI } from "../modules/ai/ai.service.js";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const registerChatSocket = (io, socket) => {
  let isAlive = true;

  socket.on("disconnect", () => {
    isAlive = false;
  });

  socket.on(SOCKET_EVENTS.MESSAGE_SEND, async ({ content, type = "text" }) => {
    const { roomId, username } = socket.data;
    if (!roomId || !username || !content || type !== "text") return;

    const userMessage = {
      roomId,
      sender: username,
      content,
      type: "text",
    };

    io.to(roomId).emit(SOCKET_EVENTS.MESSAGE_RECEIVE, userMessage);

    try {
      await saveMessage(userMessage);
    } catch (err) {
      console.error("❌ Failed to save user message:", err);
    }

    const lower = content.toLowerCase();
    const isAITrigger =
      lower.startsWith("@ai ") || lower.startsWith("@bot ");
    if (!isAITrigger) return;

    const prompt = content.replace(/^@(ai|bot)\s+/i, "").trim();
    if (!prompt) return;

    const aiMessageId = Date.now().toString();

    io.to(roomId).emit("ai:message:start", {
      id: aiMessageId,
      sender: "AI",
    });

    try {
      const fullReply = await askAI(roomId, prompt);

      // ❗ stop if room expired
      if (!io.sockets.adapter.rooms.has(roomId)) return;

      const chunks = fullReply.match(/.{1,20}/g) || [];
      let currentText = "";

      for (const chunk of chunks) {
        if (!isAlive) return;

        currentText += chunk;

        io.to(roomId).emit("ai:message:chunk", {
          id: aiMessageId,
          content: currentText,
        });

        await sleep(60);
      }

      try {
        await saveMessage({
          roomId,
          sender: "AI",
          content: fullReply,
          type: "text",
        });
      } catch (err) {
        console.error("❌ Failed to save AI message:", err);
      }

      io.to(roomId).emit("ai:message:end", { id: aiMessageId });
    } catch (err) {
      console.error("❌ AI service error:", err);

      io.to(roomId).emit(SOCKET_EVENTS.MESSAGE_RECEIVE, {
        roomId,
        sender: "AI",
        content: "⚠️ AI is temporarily unavailable.",
        type: "text",
      });
    }
  });

  socket.on(SOCKET_EVENTS.TYPING_START, () => {
    const { roomId, username } = socket.data;
    if (!roomId || !username) return;
    socket.to(roomId).emit(SOCKET_EVENTS.TYPING_START, { username });
  });

  socket.on(SOCKET_EVENTS.TYPING_STOP, () => {
    const { roomId } = socket.data;
    if (!roomId) return;
    socket.to(roomId).emit(SOCKET_EVENTS.TYPING_STOP);
  });
};

export default registerChatSocket;
