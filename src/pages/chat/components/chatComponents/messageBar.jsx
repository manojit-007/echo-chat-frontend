/* eslint-disable no-unused-vars */
import { SocketProvider, useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/apiClient";
import { useStore } from "@/store/store";
import { UPLOAD_FILE_ROUTE } from "@/utills/const";
import EmojiPicker from "emoji-picker-react";
import React, { useRef, useState, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const emojiRef = useRef(null);
  const fileInputRef = useRef();
  const socket = useSocket();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setUploadingStatus,
    setDownloadProgress,
    setDownloadingStatus,
    setUploadProgress,token
  } = useStore();
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const addEmoji = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        receiver: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
    // console.log("Message sent:", message);
    setMessage("");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileInputClick = () => {
    console.log("click");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFile = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setUploadingStatus(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }, // Correct format for headers
          
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentage = Math.round((loaded * 100) / total);
            setUploadProgress(percentage);
          },
        });
        if (response.status === 200 && response.data) {
          setUploadingStatus(false);
          setUploadProgress(0); // Reset the progress after successful upload
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              receiver: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      setUploadingStatus(false);
      setUploadProgress(0); // Reset progress on error
      console.log("Error during file upload:", error);
    }
  };
  

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center justify-center px-4 mb-2 gap-2">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-4 bg-transparent rounded-md focus:border-none focus:outline-none text-white"
        />
        <button className="text-neutral-500 hover:text-white focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" onClick={handleFileInputClick} />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFile}
        />
        <div className="relative">
          <button
            className="text-neutral-500 hover:text-white focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setShowEmoji((prev) => !prev)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {showEmoji && (
            <div className="absolute bottom-16 right-0" ref={emojiRef}>
              <EmojiPicker theme="dark" onEmojiClick={addEmoji} />
            </div>
          )}
        </div>
      </div>
      <button
        className="hover:bg-[#00a2ff] bg-[#007bff] rounded-md flex items-center justify-center p-4 text-white focus:border-none focus:outline-none duration-300 transition-all focus:text-white"
        onClick={handleSendMessage}
      >
        <IoIosSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
