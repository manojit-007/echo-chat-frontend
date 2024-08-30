/* eslint-disable no-unused-vars */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useStore } from "@/store/store";
import { HOST } from "@/utills/const";
import React, { useEffect } from "react";
import { IoExitOutline } from "react-icons/io5";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useStore();

  return (
    <div className="h-auto border-b-2 border-[#2f303b] text-white flex items-center justify-between p-2 px-8">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center bg-transparent">
          <div className="relative">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-transparent"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-2xl flex items-center justify-center rounded-full border-[1px] ${getColor(
                    selectedChatData.color
                  )}`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.charAt(0)
                    : selectedChatData.email.charAt(0)}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {selectedChatType === "contact" && selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </div>
        </div>
        <div className="flex gap-5 items-center justify-center">
          <button
            className="text-neutral-500 focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => closeChat()}
          >
            <IoExitOutline className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
