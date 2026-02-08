import { memo } from "react";
import MemberItem from "./MemberItem";

const MembersSidebar = memo(function MembersSidebar({ members = [] }) {
  return (
    <aside
      className="
        hidden md:flex flex-col
        w-64
        bg-cardDark
        border-r border-white/5
        shadow-[inset_-1px_0_0_rgba(255,255,255,0.03)]
      "
    >
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-xs uppercase tracking-wide text-gray-400">
          Members
        </h3>
        <p className="text-lg font-semibold text-gray-200">
          {members.length}
        </p>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {members.map((member) => (
          <MemberItem
            key={member.socketId}
            name={member.name}
          />
        ))}

        {members.length === 0 && (
          <p className="text-xs text-gray-500 px-2 py-4">
            No members yet
          </p>
        )}
      </div>
    </aside>
  );
});

export default MembersSidebar;
