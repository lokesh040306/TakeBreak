import { FiSmile, FiPaperclip, FiSend } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ChatInput
 * - Message input
 * - Emoji picker (local UI state)
 * - File upload trigger
 */
function ChatInput({
  message,
  setMessage,
  onSendMessage,
  onTyping,
  uploading,
  remainingTime,
  fileInputRef,
  handleFileUpload,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);

  const isDisabled = remainingTime === 0;

  /* ---------------- EMOJI ---------------- */

  const handleEmojiClick = useCallback(
    (emojiData) => {
      setMessage((prev) => prev + emojiData.emoji);
    },
    [setMessage]
  );

  /* ---------------- OUTSIDE CLICK ---------------- */

  const handleOutsideClick = useCallback((e) => {
    if (emojiRef.current && !emojiRef.current.contains(e.target)) {
      setShowEmojiPicker(false);
    }
  }, []);

  useEffect(() => {
    if (!showEmojiPicker) return;

    document.addEventListener("mousedown", handleOutsideClick);
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, [showEmojiPicker, handleOutsideClick]);

  /* ---------------- SEND ---------------- */

  const handleSend = () => {
    if (uploading || isDisabled || !message.trim()) return;
    setShowEmojiPicker(false);
    onSendMessage();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="relative border-t border-gray-800 bg-cardDark px-3 py-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*,video/*,.pdf,.zip,.doc,.docx"
        onChange={(e) =>
          e.target.files && handleFileUpload(e.target.files[0])
        }
      />

      {/* INPUT BAR */}
      <div className="flex items-end gap-2 bg-bgDark border border-gray-700 rounded-2xl px-3 py-2 shadow-sm">
        {/* File button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || isDisabled}
          className="p-2 text-gray-400 hover:text-white disabled:opacity-40 transition"
          title="Attach file"
        >
          <FiPaperclip size={18} />
        </button>

        {/* Emoji button */}
        <button
          onClick={() => setShowEmojiPicker((p) => !p)}
          disabled={isDisabled}
          className="p-2 text-gray-400 hover:text-white disabled:opacity-40 transition"
          title="Emoji"
        >
          <FiSmile size={18} />
        </button>

        {/* Text input */}
        <input
          type="text"
          value={message}
          onChange={onTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isDisabled}
          placeholder={
            isDisabled ? "Room expired" : "Type a message…"
          }
          className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder-gray-500 disabled:opacity-50"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={isDisabled || uploading || !message.trim()}
          className="bg-primary hover:bg-blue-700 active:scale-[0.95] transition px-4 py-2 rounded-xl font-medium disabled:opacity-40 flex items-center gap-1"
        >
          <FiSend size={16} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>

      {/* EMOJI PICKER */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            ref={emojiRef}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 left-3 z-50"
          >
            <EmojiPicker
              theme="dark"
              onEmojiClick={handleEmojiClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatInput;
