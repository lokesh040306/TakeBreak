import { useState, memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiDownload } from "react-icons/fi";

import TypingIndicator from "./TypingIndicator";
import ImagePreviewModal from "./ImagePreviewModal";

/* -------------------- CONSTANTS -------------------- */

const AI_COLLAPSE_LIMIT = 400;

/* -------------------- MESSAGE ITEM -------------------- */

const MessageItem = memo(function MessageItem({
  msg,
  prevMsg,
  username,
  isOwner,
  members,
  socket,
  onPreviewImage,
}) {
  const isSelf = msg.sender === username;
  const isAI = msg.sender === "AI";

  const isGrouped =
    prevMsg &&
    prevMsg.sender === msg.sender &&
    prevMsg.sender !== "SYSTEM";

  const mediaUrl = useMemo(() => {
    if (!msg.content) return "";
    return msg.content.startsWith("http")
      ? msg.content
      : `${import.meta.env.VITE_API_URL}${msg.content}`;
  }, [msg.content]);

  /* ---------------- SYSTEM MESSAGE ---------------- */

  if (msg.sender === "SYSTEM") {
    return (
      <div className="flex justify-center">
        <div className="px-4 py-1.5 text-xs text-gray-400 bg-bgDark border border-gray-700 rounded-full">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        isSelf ? "justify-end" : "justify-start"
      } ${isGrouped ? "mt-1" : "mt-3"}`}
    >
      <div className="group max-w-[72%] sm:max-w-[360px]">
        {/* USERNAME */}
        {!isGrouped && (
          <div
            className={`flex items-center gap-2 mb-1 ${
              isSelf ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-[11px] text-gray-400 tracking-wide">
              {msg.sender}
            </span>

            {isOwner && !isSelf && !isAI && (
              <button
                onClick={() => {
                  const target = members.find(
                    (m) => m.name === msg.sender
                  );
                  if (target?.socketId) {
                    socket.emit("room:kick:user", {
                      targetSocketId: target.socketId,
                    });
                  }
                }}
                className="text-[11px] text-red-400 opacity-0 group-hover:opacity-100 hover:underline transition"
              >
                Kick
              </button>
            )}
          </div>
        )}

        {/* MESSAGE BUBBLE */}
        <div
          className={`rounded-[18px_18px_18px_6px] overflow-hidden transition-all
            ${
              isSelf
              ? "bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-[18px_18px_6px_18px] shadow-md"
              : isAI
              ? "bg-[#0b1220] border border-cyan-400/30 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
              : "bg-[#111827] text-gray-100 border border-white/5 shadow-sm rounded-[18px_18px_18px_6px]"

            }
          `}
        >
          {/* IMAGE */}
          {msg.type === "image" && (
            <img
              src={mediaUrl}
              alt="uploaded"
              onClick={() => onPreviewImage(mediaUrl)}
              className="w-full max-h-[300px] object-cover cursor-pointer hover:opacity-95 transition"
            />
          )}

          {/* VIDEO */}
          {msg.type === "video" && (
            <video
              src={mediaUrl}
              controls
              className="w-full max-h-[300px] object-cover"
            />
          )}

          {/* FILE */}
          {msg.type === "file" && (
            <div className="p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">
                  {msg.fileMeta?.name || "File"}
                </p>
                <p className="text-xs text-gray-400">
                  {(msg.fileMeta?.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <a
                href={mediaUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full hover:bg-white/10 transition"
                title="Download"
              >
                <FiDownload size={16} />
              </a>
            </div>
          )}

          {/* TEXT */}
          {(!msg.type || msg.type === "text") && (
            <AITextMessage msg={msg} isAI={isAI} />
          )}
        </div>
      </div>
    </div>
  );
});

/* -------------------- AI TEXT WITH SHOW MORE -------------------- */

function AITextMessage({ msg, isAI }) {
  const [expanded, setExpanded] = useState(false);

  const isLong =
    isAI && msg.content && msg.content.length > AI_COLLAPSE_LIMIT;

  const visibleText =
    !isLong || expanded
      ? msg.content
      : msg.content.slice(0, AI_COLLAPSE_LIMIT) + "...";

  return (
    <div className="px-4 py-2.5 text-sm leading-relaxed">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {visibleText}
        </ReactMarkdown>
      </div>

      {msg.streaming && (
        <span className="animate-pulse ml-1">▍</span>
      )}

      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs text-blue-400 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

/* -------------------- CHAT MESSAGES -------------------- */

function ChatMessages({
  messages,
  username,
  isOwner,
  members,
  typingUser,
  messagesEndRef,
  socket,
}) {
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <div className="h-full overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((msg, i) => (
        <MessageItem
          key={msg._id || `${msg.sender}-${i}`}
          msg={msg}
          prevMsg={messages[i - 1]}
          username={username}
          isOwner={isOwner}
          members={members}
          socket={socket}
          onPreviewImage={setPreviewImage}
        />
      ))}

      <TypingIndicator username={typingUser} />
      <div ref={messagesEndRef} />

      <ImagePreviewModal
        src={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}

export default ChatMessages;
