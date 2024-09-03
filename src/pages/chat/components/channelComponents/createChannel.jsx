/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/apiClient";
import { GET_ALL_CONTACTS_ROUTE, CREATE_CHANNEL_ROUTE, HOST } from "@/utills/const";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { getColor } from "@/lib/utils";

const CreateChannel = () => {
  const {
    token,
    setSelectedChatType,
    setSelectedChatData,
    userInfo,
  } = useStore();

  const [newChannelModal, setNewChannelModal] = useState(false);
  const [searchAllContacts, setSearchAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  // console.log(token);
  // const cookieToken = document.cookie
  //   .split('; ')
  //   .find(row => row.startsWith('jwt='));

  // const key = token || (cookieToken ? cookieToken.split('=')[1] : null);

  const getAllContacts = async () => {
    try {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
        withCredentials: true,
        // headers: { Authorization: `Bearer ${key}` },
      });
      setSearchAllContacts(response.data.contacts);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  useEffect(() => {
     getAllContacts();
     console.log(searchAllContacts);
  }, []);

  const createChannel = async () => {
    try {
      const response = await apiClient.post(
        CREATE_CHANNEL_ROUTE,
        {
          name: channelName,
          members: selectedContacts.map(contact => contact._id),
        },
        // {
        //   headers: { Authorization: `Bearer ${key}` },
        // }
      );

      if (response.data.success) {
        setSelectedChatData(response.data.channel);
        setSelectedChatType("channel");
        setNewChannelModal(false);
      } else {
        console.error("Failed to create channel:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.some(selected => selected._id === contact._id)
        ? prevSelected.filter(selected => selected._id !== contact._id)
        : [...prevSelected, contact]
    );
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="font-light text-neutral-300 text-opacity-90 text-sm cursor-pointer hover:text-neutral-100 transition-all duration-300"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Channel Details
            </DialogTitle>
            <DialogDescription className="flex items-center justify-center">
              Please select contacts
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 border-none bg-[#2c2e3b] focus:outline-none w-full"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>

          <ScrollArea className="mb-4 h-64 bg-[#2c2e3b] rounded-lg">
            <div className="p-4">
              {searchAllContacts.length > 0 ? (
                searchAllContacts.map((contact, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-2 cursor-pointer ${selectedContacts.some(selected => selected._id === contact._id) ? 'bg-blue-500 text-white' : 'bg-transparent'}`}
                    onClick={() => handleSelectContact(contact)}
                  >
                    <Avatar className="h-12 w-12 md:w-18 md:h-18 rounded-full overflow-hidden">
              {contact.image ? (
                <AvatarImage
                  src={`${HOST}/${contact.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 md:w-18 md:h-18 text-5xl flex items-center justify-center  rounded-full border-[1px] ${getColor(
                    contact.color
                  )}`}
                >
                  {contact.firstName
                    ? contact.firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
                    <div className="flex-1">
                      <p>{contact.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No users found</p>
              )}
            </div>
          </ScrollArea>

          <Button
            className="w-full bg-gray-200 text-black hover:bg-black hover:text-white transition-all duration-300"
            onClick={createChannel}
          >
            Create Channel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
