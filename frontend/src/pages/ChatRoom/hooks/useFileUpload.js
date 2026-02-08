import { useState, useRef } from "react";

/**
 * useFileUpload
 * - Handles optimistic file preview
 * - Uploads media to backend
 * - Cleans temp messages on failure
 */
const useFileUpload = ({
  socket,
  roomId,
  username,
  setMessages,
  fileInputRef,
}) => {
  const [uploading, setUploading] = useState(false);
  const uploadingRef = useRef(false);

  const handleFileUpload = async (file) => {
    if (!file || uploadingRef.current) return;

    uploadingRef.current = true;
    setUploading(true);

    const tempId = `temp-${Date.now()}`;
    const previewUrl = URL.createObjectURL(file);

    const tempMessage = {
      _id: tempId,
      roomId,
      sender: username,
      type: file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "file",
      content: previewUrl,
      fileMeta: {
        name: file.name,
        size: file.size,
        mime: file.type,
      },
      isTemp: true,
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomId", roomId);
      formData.append("username", username);

      const res = await fetch(`/api/uploads/file?roomId=${roomId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
    } catch (err) {
      console.error("Upload failed", err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    } finally {
      URL.revokeObjectURL(previewUrl); // ✅ prevent memory leak
      uploadingRef.current = false;
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return { uploading, handleFileUpload };
};

export default useFileUpload;
