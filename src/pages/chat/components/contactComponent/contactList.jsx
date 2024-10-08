/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useStore } from "@/store/store";
import { HOST } from "@/utills/const";
import React, { useEffect, useCallback } from "react";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatType,
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useStore();

  const handleEvents = useCallback(
    (contact) => {
      const chatType = isChannel ? "channel" : "contact";
      setSelectedChatType(chatType);
      setSelectedChatData(contact);

      if (selectedChatData && selectedChatData._id !== contact._id) {
        setSelectedChatMessages([]); // Clear messages if a different contact is selected
      }
    },
    [isChannel, setSelectedChatType, setSelectedChatData, selectedChatData, setSelectedChatMessages]
  );

  useEffect(() => {
    if (selectedChatData && selectedChatData._id && contacts.length > 0) {
      const selectedContact = contacts.find(c => c._id === selectedChatData._id);
      if (selectedContact) {
        handleEvents(selectedContact);
      }
    }
  }, [contacts, selectedChatData, handleEvents]);

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer flex items-center border-b-[1px] border-gray-700 ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#ffffff] text-[#000] font-semibold"
              : "bg-black text-white hover:bg-gray-200 hover:text-black"
          }`}
          onClick={() => handleEvents(contact)}
        >
          {!isChannel && (
            <Avatar className="h-10 w-10 rounded-full mr-2 overflow-hidden">
              {contact.image ? (
                <AvatarImage
                  src={`${HOST}/${contact.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-10 w-10 text-2xl flex items-center justify-center rounded-full border-[1px] ${getColor(contact.color)}`}
                >
                  {contact.firstName 
                    ? contact.firstName[0] 
                    : contact.email[0]}
                </div>
              )}
            </Avatar>
          )}
          {isChannel && (
            <div
              className={`mr-2 uppercase h-10 w-10 text-2xl flex items-center justify-center rounded-full border-[1px] ${getColor()}`}
            >
              {contact.name ? contact.name[0] : "#"}
            </div>
          )}
          <span>
            {isChannel ? contact.name : `${contact.firstName || ''} ${contact.lastName || ''}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
