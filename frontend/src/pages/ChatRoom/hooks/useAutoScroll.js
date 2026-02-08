import { useEffect } from "react";

/**
 * useAutoScroll
 * - Scrolls chat to bottom when messages change
 */
const useAutoScroll = (messages, messagesEndRef) => {
  useEffect(() => {
    if (!messagesEndRef?.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);
};

export default useAutoScroll;
