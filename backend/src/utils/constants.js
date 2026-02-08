// src/utils/constants.js

/**
 * ====================================================
 * ROOM DURATION CONSTANTS
 * ====================================================
 *
 * Defines the allowed room durations (in minutes).
 * Only these values are permitted during room creation.
 *
 * Using Object.freeze ensures:
 * - Values cannot be mutated at runtime
 * - Consistent validation across the app
 */
export const ROOM_DURATIONS = Object.freeze([15, 30, 45, 60]);

/**
 * ====================================================
 * SOCKET EVENT CONSTANTS
 * ====================================================
 *
 * Centralized socket event names to:
 * - Avoid hardcoded strings
 * - Prevent typos and mismatches
 * - Keep frontend & backend in sync
 *
 * IMPORTANT:
 * - Any new socket event should be added here
 * - Both client and server must use these constants
 */
export const SOCKET_EVENTS = Object.freeze({
  /* ---------------- ROOM EVENTS ---------------- */

  ROOM_CREATE: "room:create",
  ROOM_JOIN: "room:join",
  ROOM_LEAVE: "room:leave",
  ROOM_EXPIRED: "room:expired",

  /* ---------------- CHAT EVENTS ---------------- */

  MESSAGE_SEND: "message:send",
  MESSAGE_RECEIVE: "message:receive",

  /* ---------------- TYPING EVENTS ---------------- */

  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",

  /* ---------------- USER EVENTS ---------------- */

  USER_JOINED: "user:joined",
  USER_LEFT: "user:left",

  /* ---------------- AI EVENTS ---------------- */

  AI_MESSAGE_START: "ai:message:start",
  AI_MESSAGE_CHUNK: "ai:message:chunk",
  AI_MESSAGE_END: "ai:message:end",
});
