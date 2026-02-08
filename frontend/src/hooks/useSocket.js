// src/hooks/useSocket.js
import { useEffect } from "react";
import socket, { connectSocket } from "../services/socket";

/**
 * Ensures socket is connected.
 * Does NOT manage listeners or disconnection.
 */
const useSocket = () => {
  useEffect(() => {
    connectSocket();
  }, []);

  return socket;
};

export default useSocket;
