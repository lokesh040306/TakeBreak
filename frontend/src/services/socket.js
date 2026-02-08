// src/services/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

if (!SOCKET_URL) {
  throw new Error("VITE_SOCKET_URL is not defined");
}

/**
 * Single shared Socket.IO client instance
 * MUST be used across the entire app
 */
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["polling", "websocket"],
});

/**
 * Connect socket safely (idempotent)
 */
export const connectSocket = () => {
  if (!socket.connected && !socket.connecting) {
    socket.connect();
  }
};

/**
 * Disconnect socket safely
 */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

/**
 * Socket state helpers
 */
export const isSocketConnected = () => socket.connected;
export const isSocketConnecting = () => socket.connecting;

export default socket;
