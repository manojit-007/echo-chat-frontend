/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { apiClient } from "@/lib/apiClient";
import { useStore } from "@/store/store";
import { CHANNEL_MESSAGES, GET_ALL_MESSAGES_ROUTE, HOST } from "@/utills/const";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdDownload } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";
import { IoMdCloseCircle } from "react-icons/io";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const messageContainer = () => {
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    sstSelectedChatMessages, setUploadingStatus,
    setDownloadProgress,
    setDownloadingStatus,
    setUploadProgress
  } = useStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const scrollRef = useRef();

  useEffect(() => {
    const getMessages = async () => {
      try {
        // Fetch messages for contacts
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          sstSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log("Error fetching contact messages:", error);
      }
    };
  
    const getChannelMessages = async () => {
      try {
        // Fetch messages for channels
        const response = await apiClient.get(
          `${CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          sstSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log("Error fetching channel messages:", error);
      }
    };
  
    // Conditional fetch based on selected chat type
    if (selectedChatData && selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      } else if (selectedChatType === "channel") {
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType, sstSelectedChatMessages]);

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
          {selectedChatType === "channel" && renderChannelMessages(message)}
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
          className={`${messageStyle} border inline-block px-6 py-2 text-lg rounded my-1 w-auto max-w-[200px] break-words`}
          style={{ fontFamily: "monospace", overflowWrap: "break-word" }}
        >
          {message.content}.slice(0,45)
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
                  className="text-gray-100 hover:text-white cursor-pointer transition-all duration-300"
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

  const renderChannelMessages = (message) => {
    console.log("hello world!");
    console.log(message);
    console.log(userInfo);
    const isSender = message.sender._id === userInfo.id;
    const messageStyle = isSender
      ? "bg-[#2c2c2c] text-white border-[#6e6e6e]" // Dark gray background with lighter gray border for sent messages
      : "bg-[#f5f5f5] text-black border-[#d1d1d1]"; // Light gray background with darker gray border for received messages

    if (message.messageType === "text") {
      return <div className="mb-6">
        <div className={`flex items-start  ${isSender ? "flex-row-reverse" : ""}`}>
          {/* Sender's Avatar */}
          <Skeleton className="h-8 w-8 rounded-full mb-auto mx-2 animate-none">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image ? (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-8 w-8 flex items-center justify-center rounded-full bg-black border-[1px] ${getColor(
                    message.sender.color
                  )}`}
                >
                  {message.sender.firstName
                    ? message.sender.firstName.charAt(0)
                    : userInfo.email.charAt(0)}
                </div>
              )}
            </Avatar>
          </Skeleton>
          {/* Message Content */}
          <div className={`space-y-2 relative ${isSender ? "text-right" : "text-left"}`}>
            {/* Sender's Name */}
            <Skeleton
              className={`h-4 w-auto max-w-[100px] overflow-hidden px-2 flex justify-center items-center animate-none ${isSender ? "ml-auto" : "mr-auto"
                }`}
            >
              <span className="text-sm font-semibold">{isSender ? "You" : `${message.sender.firstName} ${message.sender.lastName}`} </span>
            </Skeleton>
            {/* Message Bubble */}
            <Skeleton
              className={`h-auto w-auto max-w-[75%] flex justify-start items-center p-2 rounded-md animate-none 
        ${isSender ? "ml-auto bg-gray-100 text-black" : "border border-gray-600 mr-auto bg-gray-900 text-white"}
      `}
            >
              <span className="text-sm text-left font-semibold" style={{fontFamily: "monospace"}}>{message.content}</span>
            </Skeleton>

            {/* Timestamp */}
            <div className={`text-xs ${isSender ? "text-gray-500" : "text-gray-400"}`}>
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        </div>
      </div>
    }

    if (message.messageType === "file") {
      return <div className="mb-6 font-mono">
        <div className={`flex items-start  ${isSender ? "flex-row-reverse" : ""}`}>
          {/* Sender's Avatar */}
          <Skeleton className="h-8 w-8 rounded-full mb-auto mx-2 animate-none">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image ? (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-8 w-8 flex items-center justify-center rounded-full bg-black border-[1px] ${getColor(
                    message.sender.color
                  )}`}
                >
                  {message.sender.firstName
                    ? message.sender.firstName.charAt(0)
                    : userInfo.email.charAt(0)}
                </div>
              )}
            </Avatar>
          </Skeleton>
          {/* Message Content */}
          <div className={`space-y-2 relative ${isSender ? "text-right" : "text-left"}`}>
            {/* Sender's Name */}
            <Skeleton
              className={`h-4 w-16 flex justify-center items-center animate-none ${isSender ? "ml-auto" : "mr-auto"
                }`}
            >
              <span className="text-sm font-semibold">{isSender ? "You" : message.sender.firstName}</span>
            </Skeleton>
            {/* Message Bubble */}
            <Skeleton
              className={`h-auto w-auto max-w-[75%] flex justify-start items-center border bg-transparent p-2 rounded-md animate-none ${isSender ? "ml-auto " : "mr-auto "} `}
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
                <div className="flex items-center space-x-2 h-auto w-[200px] overflow-hidden">
                  <span>📁</span>

                  <button
                    className="text-gray-500 hover:text-white cursor-pointer transition-all duration-300"
                    onClick={() => fileDownload(message.fileUrl)}
                  >
                    <MdDownload />
                  </button>
                  <a
                    href={`${HOST}/${message.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                    download={`${HOST}/${message.fileUrl}`}
                  >
                    {message.fileUrl.split("\\").pop()}
                  </a>
                </div>
              )}

            </Skeleton>

            {/* Timestamp */}
            <div className={`text-xs ${isSender ? "text-gray-500" : "text-gray-400"}`}>
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        </div>
      </div>
    }

  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg-w-[70vw] xl:w-[80vw] sm:w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 w-full h-full bg-black opacity-100 flex items-center justify-center">
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
              className="text-gray-200 p-2 bg-black hover:bg-white hover:text-black rounded-full cursor-pointer transition-all duration-300 text-xl"
              onClick={() => fileDownload(imageUrl)}
            >
              <MdDownload />
            </button>
            <button
              className="text-gray-200 p-2 bg-black hover:bg-white hover:text-black rounded-full cursor-pointer transition-all duration-300 text-xl"
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
