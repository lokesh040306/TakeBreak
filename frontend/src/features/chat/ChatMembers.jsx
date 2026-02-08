// import { FiX } from "react-icons/fi";

// /**
//  * ChatMembers
//  * - Shows room members
//  * - Owner can kick users
//  * - Used as sidebar (desktop) or overlay (mobile)
//  */
// function ChatMembers({
//   members,
//   isOwner,
//   onKick,
//   onClose,
//   variant = "sidebar",
// }) {
//   return (
//     <div
//       className={`${
//         variant === "sidebar"
//           ? "hidden md:flex md:w-64 md:flex-col"
//           : "fixed inset-0 bg-black/50 z-50 flex justify-end md:hidden"
//       }`}
//     >
//       <div className="bg-cardDark w-64 h-full border-l border-gray-800 flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
//           <h3 className="font-semibold">Members</h3>
//           {variant === "overlay" && (
//             <button onClick={onClose}>
//               <FiX size={18} />
//             </button>
//           )}
//         </div>

//         {/* Member list */}
//         <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
//           {members.map((m) => (
//             <div
//               key={m.socketId}
//               className="flex items-center justify-between px-2 py-1 rounded hover:bg-bgDark"
//             >
//               <span className="text-sm truncate">{m.username}</span>

//               {isOwner && (
//                 <button
//                   onClick={() => onKick(m.socketId)}
//                   className="text-xs text-red-400 hover:underline"
//                 >
//                   Kick
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatMembers;
