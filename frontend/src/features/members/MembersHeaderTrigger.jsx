import { memo } from "react";

const MembersHeaderTrigger = memo(function MembersHeaderTrigger({
  count = 0,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Show members"
      className="
        md:hidden
        flex items-center gap-1
        px-3 py-1.5
        rounded-full
        text-xs font-medium
        text-gray-200
        bg-white/5
        hover:bg-white/10
        transition
        active:scale-[0.97]
      "
    >
      <span className="font-semibold">{count}</span>
      <span className="opacity-80">members</span>
    </button>
  );
});

export default MembersHeaderTrigger;
