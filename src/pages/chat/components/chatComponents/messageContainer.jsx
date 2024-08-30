/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { apiClient } from "@/lib/apiClient";
import { useStore } from "@/store/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utills/const";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdDownload } from "react-icons/md";
import axios from "axios";
import { IoMdCloseCircle } from "react-icons/io";

const messageContainer = () => {
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    sstSelectedChatMessages,setUploadingStatus,
    setDownloadProgress,
    setDownloadingStatus,
    setUploadProgress,token
  } = useStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const scrollRef = useRef();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true,headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.messages) {
          sstSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChatData && selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, sstSelectedChatMessages, token]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const fileDownload = async (fileUrl) => {
    setDownloadingStatus(true)
    setDownloadProgress(0)
    try {
      const normalizedUrl = fileUrl.replace(/\\/g, "/").replaceAll(" ", "%20");
      console.log(`${HOST}/${fileUrl}`);
      const response = await apiClient.get(`${HOST}/${normalizedUrl}`, {
        responseType: "blob", 
        
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }, // Correct format for headers
        
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setDownloadProgress(progress);
        }
      });
  
      const blobUrl = window.URL.createObjectURL(response.data); // response.data contains the blob
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", normalizedUrl.split("/").pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      setDownloadingStatus(false)
      setDownloadProgress(0)
    } catch (error) {
      console.log("Error downloading the file", error);
    }
  };
  

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-sm text-gray-100 flex justify-center items-center text-center my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderChatMessages(message)}
        </div>
      );
    });
  };

  const checkImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return imageRegex.test(filePath);
  };

  const renderChatMessages = (message) => {
    const isSender = message.sender === selectedChatData._id;
    const messageStyle = isSender
      ? "bg-[#11021b] text-white border-purple-400"
      : "bg-slate-900 text-white border-sky-300";

    return (
      <div className={isSender ? "text-left" : "text-right"}>
        {/* Render text messages */}
        {message.messageType === "text" && (
          <div
            className={`${messageStyle} border inline-block px-6 py-2 text-lg rounded my-1 max-w-[50%] break-words`}
            style={{ fontFamily: "monospace" }}
          >
            {message.content}
          </div>
        )}

        {/* Render file messages */}
        {message.messageType === "file" && (
          <div
            className={`${messageStyle} border inline-block text-lg rounded my-1 max-w-[50%] break-words`}
          >
            {checkImage(message.fileUrl) ? (
              <div className="cursor-pointer">
                <img
                  className="object-contain w-[300px] h-auto"
                  src={`${HOST}/${message.fileUrl.replace(/\\/g, "/")}`}
                  onClick={() => {
                    setShowImage(true), setImageUrl(message.fileUrl);
                  }}
                  alt="file"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>📁</span>
                <a
                  href={`${HOST}/${message.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400"
                  download={`${HOST}/${message.fileUrl}`}
                >
                  {message.fileUrl.split("\\").pop()}
                </a>
                <button
                  className="text-gray-500 hover:text-white cursor-pointer transition-all duration-300"
                  onClick={() => fileDownload(message.fileUrl)}
                >
                  <MdDownload />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Render timestamp */}
        <div className="text-xs text-white">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg-w-[70vw] xl:w-[80vw] sm:w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 w-full h-full bg-gray-800 opacity-100 flex items-center justify-center">
          <div>
            <img
              className="object-contain w-[700px] h-auto"
              src={`${HOST}/${imageUrl.replace(/\\/g, "/")}`}
              alt="file"
              onClick={() => setShowImage(false)}
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="text-gray-500 hover:text-white cursor-pointer transition-all duration-300"
              onClick={() => fileDownload(imageUrl)}
            >
              <MdDownload />
            </button>
            <button
              className="text-gray-500 hover:text-white cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false), setImageUrl(null);
              }}
            >
              <IoMdCloseCircle />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default messageContainer;
