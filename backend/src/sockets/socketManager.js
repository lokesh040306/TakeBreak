// backend/src/config/socketManager.js

let ioInstance = null;

export const setIO = (io) => {
  if (!io) {
    throw new Error("Attempted to set invalid Socket.IO instance");
  }

  if (ioInstance) {
    console.warn("⚠️ Socket.IO instance already set. Reusing existing instance.");
    return ioInstance;
  }

  ioInstance = io;
  console.log("🔗 Socket.IO instance stored globally");

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error(
      "Socket.IO instance not initialized. Ensure initSocket() is called before using getIO()."
    );
  }

  return ioInstance;
};
