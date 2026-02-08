import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemberItem from "./MemberItem";

const MembersDrawer = memo(function MembersDrawer({
  open,
  onClose,
  members = [],
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="
              absolute right-0 top-0 h-full w-72
              bg-cardDark
              border-l border-white/5
              shadow-2xl
              flex flex-col
            "
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Members
                </p>
                <p className="text-lg font-semibold text-gray-200">
                  {members.length}
                </p>
              </div>

              <button
                onClick={onClose}
                className="px-2 py-1 text-sm text-gray-400 hover:text-white transition"
              >
                Close
              </button>
            </div>

            {/* Members list */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
              {members.length === 0 ? (
                <p className="text-sm text-gray-500 text-center mt-6">
                  No members yet
                </p>
              ) : (
                members.map((member) => (
                  <MemberItem
                    key={member.socketId}
                    name={member.name}
                  />
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default MembersDrawer;
