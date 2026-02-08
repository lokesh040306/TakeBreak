import { FiX } from "react-icons/fi";
import { useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ImagePreviewModal = memo(function ImagePreviewModal({ src, onClose }) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  /* ---------------- SIDE EFFECTS ---------------- */

  useEffect(() => {
    if (!src) return;

    // Lock background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [src, handleClose]);

  /* ---------------- UI ---------------- */

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* CLOSE BUTTON */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-white hover:bg-white/10 transition"
            aria-label="Close image preview"
          >
            <FiX size={22} />
          </button>

          {/* IMAGE */}
          <motion.img
            src={src}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl select-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default ImagePreviewModal;
