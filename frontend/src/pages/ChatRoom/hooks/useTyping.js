import { useRef } from "react";

/**
 * useTyping
 * - Emits typing:start once per typing session
 * - Emits typing:stop after debounce
 * - Persists typing state correctly across renders
 */
const useTyping = (socket, setMessage, typingTimeoutRef) => {
  const isTypingRef = useRef(false);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!isTypingRef.current && socket.connected) {
      socket.emit("typing:start");
      isTypingRef.current = true;
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (socket.connected && isTypingRef.current) {
        socket.emit("typing:stop");
      }
      isTypingRef.current = false;
    }, 800);
  };

  const stopTyping = () => {
    clearTimeout(typingTimeoutRef.current);

    if (isTypingRef.current && socket.connected) {
      socket.emit("typing:stop");
      isTypingRef.current = false;
    }
  };

  return { handleTyping, stopTyping };
};

export default useTyping;
