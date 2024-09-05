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
import { Badge } from "@/components/ui/badge";
import { IoIosClose } from "react-icons/io";
import { toast } from "sonner";



const CreateChannel = () => {
  const {
    setSelectedChatType,
    setSelectedChatData,
    userInfo,
    addChannel
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
  }, [newChannelModal, setNewChannelModal]);

  const createChannel = async () => {
    try {
      if (channelName.trim() === "") {
        toast.error("Channel name is required.");
        return;
      }
      if (selectedContacts.length === 0) {
        toast.error("Select at least one contact.");
        return;
      }
      if (selectedContacts.some(contact => contact._id === userInfo._id)) {
        toast.error("You can't create a channel with yourself.");
        return;
      }

      const response = await apiClient.post(
        CREATE_CHANNEL_ROUTE,
        {
          name: channelName,
          members: selectedContacts.map(contact => contact._id),
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setChannelName("");
        setSelectedContacts([]);
        addChannel(response.data.channel);
        setSelectedChatType("channel");
        setSelectedChatData(response.data.channel);
        setNewChannelModal(false);
      } else {
        toast.error("Failed to create channel:", response.data.message);
      }
    } catch (error) {
      // console.log("Error creating channel:", error.response ? error.response.data : error.message);
      toast.error("Error creating channel:", error.message);
    }
  };

  // const createChannel = async () => {
  //   try {
  //     if (channelName.trim() === "") {
  //       toast.error("Channel name is required.");
  //       return;
  //     }
  //     if (selectedContacts.length === 0) {
  //       toast.error("Select at least one contact.");
  //       return;
  //     }
  //     if (selectedContacts.some(contact => contact._id === userInfo._id)) {
  //       toast.error("You can't create a channel with yourself.");
  //       return;
  //     }
  //     const response = await apiClient.post(
  //       CREATE_CHANNEL_ROUTE,
  //       {
  //         name: channelName,
  //         // members: selectedContacts.map(contact => contact.value),
  //         members: selectedContacts.map((contact) => contact._id),
  //       },
  //       { withCredentials: true }
  //     );

  //     console.log(response);
  //     if (response.status === 201) {
  //       setChannelName("");
  //       setSelectedContacts([]);
  //       // setSelectedChatData(response.data.channel);
  //       addChannel(response.data.channel);
  //       setSelectedChatType("channel");
  //       setNewChannelModal(false);
  //     } else {
  //     toast.error("Failed to create channel:", response);
  //     }
  //   } catch (error) {
  //     console.log("Error creating channel:", error.response ? error.response.data : error.message);
  //     toast.error("Error creating channel:", error.message);
  //   }
  // };

  const handleSelectContact = (contact) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.some(selected => selected._id === contact._id)
        ? prevSelected.filter(selected => selected._id !== contact._id)
        : [...prevSelected, contact]
    );
  };
  // console.log(selectedContacts);
  useEffect(() => {
    if (newChannelModal === false) {
      setSelectedContacts([])
    }
  }, [newChannelModal]);

  const handleRemoveContact = (contact) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.filter((selected) => selected._id !== contact._id)
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
        <DialogContent className="bg-slate-100 border text-black w-[400px] h-[550px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Channel Details
            </DialogTitle>
            <DialogDescription className="flex items-center justify-center">
              Please select contacts
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Channel Name"
            className="rounded-lg p-2 border border-gray-400 bg-gray-50 focus:outline-none w-full"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />

          <p className="font-semibold text-gray-700">Selected Contacts:</p>
          <ScrollArea className="overflow-auto h-12 max-h-12 border rounded-lg p-[4px]">
            {selectedContacts.length > 0 ? (
              selectedContacts.map((contact, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-black border bg-white rounded-lg m-[2px] p-[4px] text-sm"
                >
                  {contact.name}
                  <IoIosClose className=" cursor-pointer text-gray-600 hover:text-black"
                    onClick={() => handleRemoveContact(contact)}
                  />
                </Badge>
              ))
            ) : (
              <p className="text-gray-950 text-sm text-center mt-1">No contacts selected.</p>
            )}
          </ScrollArea>


          <ScrollArea className="mb-2 h-64 bg-gray-50 border rounded-lg">
            <div className="p-4">
              {searchAllContacts.length > 0 ? (
                searchAllContacts.map((contact, index) => {
                  const isSelected = selectedContacts.some(
                    (selected) => selected._id === contact._id
                  );

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-4 p-2 cursor-pointer mb-[5px] border rounded-lg transition-all duration-300 ${isSelected
                        ? 'bg-gray-400 text-white shadow-lg'
                        : 'bg-gray-200 hover:bg-gray-300 hover:text-black'}
                        }`}
                      onClick={() => handleSelectContact(contact)}
                    >
                      <Avatar className="h-8 w-8 md:w-18 md:h-18 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="profile"
                            className="object-cover w-full h-full bg-black"
                          />
                        ) : (
                          <div
                            className={`uppercase h-8 w-8 md:w-18 md:h-18 text-5xl flex items-center justify-center rounded-full border-[1px] ${getColor(
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
                  );
                })
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
