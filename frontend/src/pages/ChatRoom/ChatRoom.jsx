import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import socket, { disconnectSocket } from "../../services/socket";
import useRoomTimer from "../../hooks/useRoomTimer";

import useChatSocket from "./hooks/useChatSocket";
import useTyping from "./hooks/useTyping";
import useFileUpload from "./hooks/useFileUpload";
import useAutoScroll from "./hooks/useAutoScroll";

import ChatHeader from "../../features/chat/ChatHeader";
import ChatMessages from "../../features/chat/ChatMessages";
import ChatInput from "../../features/chat/ChatInput";

import MembersSidebar from "../../features/members/MembersSidebar";
import MembersDrawer from "../../features/members/MembersDrawer";

function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  /* -------------------- STATE -------------------- */

  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [typingUser, setTypingUser] = useState("");

  const [expiresAt, setExpiresAt] = useState(null);
  const remainingTime = useRoomTimer(expiresAt);

  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const [showMembers, setShowMembers] = useState(false);

  /* -------------------- REFS -------------------- */

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const hasJoinedRef = useRef(false);

  /* -------------------- EFFECTS -------------------- */

  useAutoScroll(messages, messagesEndRef);

  useChatSocket({
    socket,
    roomId,
    navigate,
    isJoined,
    setMessages,
    setExpiresAt,
    setIsOwner,
    setMembers,
    setMemberCount,
    setTypingUser,
  });

  useEffect(() => {
    return () => {
      if (hasJoinedRef.current) {
        disconnectSocket();
      }
    };
  }, []);

  /* -------------------- HOOKS -------------------- */

  const { handleTyping, stopTyping } = useTyping(
    socket,
    setMessage,
    typingTimeoutRef
  );

  const { uploading, handleFileUpload } = useFileUpload({
    socket,
    roomId,
    username,
    setMessages,
    fileInputRef,
  });

  /* -------------------- ACTIONS -------------------- */

  const handleJoinRoom = () => {
    if (!username.trim()) return;

    socket.auth = { username };

    socket.emit("room:join", {
      roomId,
      username,
    });

    hasJoinedRef.current = true;
    setIsJoined(true);
  };

  const handleSendMessage = () => {
    if (!message.trim() || remainingTime === 0) return;

    socket.emit("message:send", { content: message });
    setMessage("");
    stopTyping();
  };

  const handleLeaveRoom = () => {
    if (hasJoinedRef.current) {
      disconnectSocket();
    }
    navigate("/");
  };

  /* -------------------- JOIN SCREEN -------------------- */

  if (!isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-bgDark to-black">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleJoinRoom();
          }}
          className="bg-cardDark p-6 rounded-xl w-full max-w-sm shadow-xl border border-gray-800"
        >
          <h2 className="text-xl font-semibold mb-5 text-center">
            Enter Username
          </h2>

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded bg-bgDark border border-gray-700 mb-5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            placeholder="Your name"
          />

          <button className="w-full bg-primary py-3 rounded font-medium hover:bg-blue-700 transition active:scale-[0.98]">
            Join Room
          </button>
        </motion.form>
      </div>
    );
  }

  /* -------------------- CHAT UI -------------------- */

  return (
    <div className="min-h-screen flex bg-bgDark overflow-hidden">
      {/* Desktop Sidebar */}
      <MembersSidebar members={members} />

      {/* Main Chat */}
      <div className="flex flex-col flex-1 h-screen">
        <ChatHeader
          roomId={roomId}
          isOwner={isOwner}
          remainingTime={remainingTime}
          memberCount={memberCount}
          onMembersClick={() => setShowMembers(true)}
          onCopyRoomId={() => navigator.clipboard.writeText(roomId)}
          onRequestRoomPassword={() =>
            socket.emit("room:password:request")
          }
          onLeaveRoom={handleLeaveRoom}
        />

        <motion.div
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <ChatMessages
            messages={messages}
            username={username}
            isOwner={isOwner}
            members={members}
            typingUser={typingUser}
            messagesEndRef={messagesEndRef}
            socket={socket}
          />
        </motion.div>

        <ChatInput
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          uploading={uploading}
          remainingTime={remainingTime}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
        />
      </div>

      {/* Mobile Members Drawer */}
      <AnimatePresence>
        {showMembers && (
          <MembersDrawer
            open={showMembers}
            onClose={() => setShowMembers(false)}
            members={members}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatRoom;
