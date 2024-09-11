/* eslint-disable no-unused-vars */
import { useStore } from "@/store/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
  ContactContainer,
  ChatContainer,
  EmptyChatContainer,
} from "./components/index";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    uploadingStatus,
    downloadProgress,
    downloadingStatus,
    uploadProgress,
  } = useStore();
  const navigate = useNavigate();
  // console.log(token);

  useEffect(() => {
    console.log(userInfo);
    if (!userInfo.profileSetup) {
      toast("Please set up your profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-black overflow-hidden">
      {uploadingStatus && (
        <div className="h-[200px] w-[200px] text-black fixed font-semibold top-[50%] left-[50%] z-10 bg-sky-100 p-2 rounded-sm flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-2xl text-center animate-pulse">
            Uploading file : {uploadProgress}%
          </h5>
          <Progress value={uploadProgress} className="w-[60%]" />
        </div>
      )}
      {downloadingStatus && (
        <div className="h-[200px] w-[200px] text-black font-semibold fixed top-[50%] right-[0%] z-10 p-2 rounded-sm bg-emerald-300 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-2xl animate-pulse">
            Downloading file: {downloadProgress}%{" "}
          </h5>
          <Progress value={downloadProgress} className="w-[60%]" />
        </div>
      )}
      <ContactContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
