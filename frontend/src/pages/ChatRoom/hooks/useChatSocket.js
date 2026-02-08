// frontend/src/pages/ChatRoom/hooks/useChatSocket.js
import { useEffect, useRef } from "react";
import { connectSocket } from "../../../services/socket";

const useChatSocket = ({
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
}) => {
  const prevMembersRef = useRef([]);

  useEffect(() => {
    // ✅ ALWAYS CALLED, but does nothing until joined
    if (!isJoined) return;

    connectSocket();

    /* -------- ROOM -------- */

    const onRoomJoined = ({ expiresAt }) => {
      setExpiresAt(expiresAt);
      socket.emit("presence:join", {
        roomId,
        username: socket.auth?.username,
      });
    };

    const onRoomOwner = ({ isOwner }) => {
      setIsOwner(isOwner);
    };

    /* -------- PRESENCE -------- */

    const onMembersUpdate = ({ members = [], count = 0 }) => {
      const prev = prevMembersRef.current || [];

      members.forEach((m) => {
        if (!prev.find((p) => p.name === m.name)) {
          setMessages((msgs) => [
            ...msgs,
            { sender: "SYSTEM", content: `${m.name} joined the room` },
          ]);
        }
      });

      prev.forEach((p) => {
        if (!members.find((m) => m.name === p.name)) {
          setMessages((msgs) => [
            ...msgs,
            { sender: "SYSTEM", content: `${p.name} left the room` },
          ]);
        }
      });

      prevMembersRef.current = members;
      setMembers(members);
      setMemberCount(count);
    };

    /* -------- CHAT -------- */

    const onMessageReceive = (data) => {
      setMessages((prev) => {
        const filtered = prev.filter(
          (m) =>
            !(
              m.isTemp &&
              m.sender === data.sender &&
              m.fileMeta?.name === data.fileMeta?.name
            )
        );
        return [...filtered, data];
      });
    };

    /* -------- TYPING -------- */

    const onTypingStart = ({ username }) => setTypingUser(username);
    const onTypingStop = () => setTypingUser("");

    /* -------- ADMIN -------- */

    const onPasswordResponse = ({ password }) => {
      alert(`Room Password: ${password}`);
    };

    const onKicked = ({ message }) => {
      alert(message || "You were kicked");
      navigate("/");
    };

    const onExpired = ({ message }) => {
      alert(message);
      navigate("/");
    };

    /* -------- REGISTER -------- */

    socket.on("room:joined", onRoomJoined);
    socket.on("room:owner", onRoomOwner);
    socket.on("members:update", onMembersUpdate);
    socket.on("message:receive", onMessageReceive);
    socket.on("typing:start", onTypingStart);
    socket.on("typing:stop", onTypingStop);
    socket.on("room:password:response", onPasswordResponse);
    socket.on("room:kicked", onKicked);
    socket.on("room:expired", onExpired);

    /* -------- CLEANUP -------- */
    return () => {
      socket.off("room:joined", onRoomJoined);
      socket.off("room:owner", onRoomOwner);
      socket.off("members:update", onMembersUpdate);
      socket.off("message:receive", onMessageReceive);
      socket.off("typing:start", onTypingStart);
      socket.off("typing:stop", onTypingStop);
      socket.off("room:password:response", onPasswordResponse);
      socket.off("room:kicked", onKicked);
      socket.off("room:expired", onExpired);
    };
  }, [isJoined, roomId, navigate]);
};

export default useChatSocket;
