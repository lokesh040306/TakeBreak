import { memo } from "react";

const MemberItem = memo(function MemberItem({ name }) {
  const displayName = name || "Unknown";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold">
        {avatarLetter}
      </div>
      <span className="text-sm truncate">{displayName}</span>
    </div>
  );
});

export default MemberItem;
