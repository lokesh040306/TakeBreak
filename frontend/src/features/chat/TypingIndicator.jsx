import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TypingIndicator = memo(function TypingIndicator({ username }) {
  return (
    <AnimatePresence>
      {username && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 px-3 py-1.5 mt-1 w-fit rounded-full bg-bgDark border border-gray-700 text-xs text-gray-400"
        >
          <span className="truncate max-w-[140px]">
            {username} is typing
          </span>

          {/* DOTS */}
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default TypingIndicator;
