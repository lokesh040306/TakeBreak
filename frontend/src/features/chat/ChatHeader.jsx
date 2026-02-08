import { useEffect, useRef, useCallback, useMemo } from "react";
import {
  FiArrowLeft,
  FiCopy,
  FiMoreVertical,
  FiUsers,
  FiLogOut,
  FiClock,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function ChatHeader({
  roomId,
  isOwner,
  remainingTime,
  memberCount,
  onMembersClick,
  onCopyRoomId,
  onRequestRoomPassword,
  onLeaveRoom,
}) {
  const menuRef = useRef(null);

  /* ---------------- TIME FORMAT ---------------- */

  const formattedTime = useMemo(() => {
    if (!remainingTime || remainingTime <= 0) return "Expired";
    const m = Math.floor(remainingTime / 60000);
    const s = Math.floor((remainingTime % 60000) / 1000);
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [remainingTime]);

  /* ---------------- TIME STATE ---------------- */

  const timeState = useMemo(() => {
    if (!remainingTime || remainingTime <= 0) return "expired";
    if (remainingTime <= 60_000) return "critical"; // <= 1 min
    if (remainingTime <= 5 * 60_000) return "warning"; // <= 5 min
    return "normal";
  }, [remainingTime]);

  /* ---------------- MENU CONTROL ---------------- */

  const closeMenu = useCallback(() => {
    if (menuRef.current?.hasAttribute("open")) {
      menuRef.current.removeAttribute("open");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

  /* ---------------- UI ---------------- */

  return (
    <header
      className={`relative z-20 px-3 py-2 flex items-center justify-between gap-3 border-b transition-colors duration-300
        ${
          timeState === "critical"
            ? "bg-red-900/20 border-red-500/40"
            : timeState === "warning"
            ? "bg-yellow-900/20 border-yellow-500/40"
            : "bg-cardDark border-gray-800"
        }
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onLeaveRoom}
          className="p-2 rounded-full hover:bg-bgDark transition"
          title="Back"
        >
          <FiArrowLeft size={18} />
        </button>

        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-gray-400">
            Room
          </p>

          <div className="flex items-center gap-2">
            <span className="font-medium truncate max-w-[160px] sm:max-w-none">
              {roomId}
            </span>

            {isOwner && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-yellow-500 text-yellow-400">
                Owner
              </span>
            )}

            <button
              onClick={onCopyRoomId}
              className="p-1 rounded hover:text-primary transition"
              title="Copy room ID"
            >
              <FiCopy size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* CENTER — TIME */}
      <div
        className={`hidden sm:flex items-center gap-1 text-xs
          ${
            timeState === "critical"
              ? "text-red-400 animate-pulse"
              : timeState === "warning"
              ? "text-yellow-400"
              : "text-gray-400"
          }
        `}
      >
        <FiClock size={14} />
        <span>{formattedTime}</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 text-gray-400">
        {/* MEMBERS */}
        <button
          onClick={onMembersClick}
          className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-bgDark transition lg:pointer-events-none"
          title="Members"
        >
          <FiUsers size={14} />
          <span className="text-sm">{memberCount}</span>
        </button>

        {/* MENU */}
        <details ref={menuRef} className="relative">
          <summary className="list-none cursor-pointer p-2 rounded-full hover:bg-bgDark transition">
            <FiMoreVertical size={18} />
          </summary>

          <AnimatePresence>
            {menuRef.current?.hasAttribute("open") && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-48 bg-cardDark border border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden"
              >
                {isOwner && (
                  <button
                    onClick={() => {
                      closeMenu();
                      onRequestRoomPassword();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-bgDark transition"
                  >
                    View Room Password
                  </button>
                )}

                <button
                  onClick={() => {
                    closeMenu();
                    onLeaveRoom();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-bgDark transition"
                >
                  <FiLogOut size={14} />
                  Leave Room
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </details>
      </div>
    </header>
  );
}

export default ChatHeader;
