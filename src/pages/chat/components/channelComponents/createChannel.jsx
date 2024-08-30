/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
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
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/apiClient";
import { HOST, SEARCH_CONTACT_ROUTE } from "@/utills/const";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/store/store";

const CreateChannel = () => {
  const {
    selectedChatType,
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
  } = useStore();
  const [openNewContactModal, setUpNewContactModal] = useState(false);
  const [searchAllContacts, setSearchAllContacts] = useState([]);
  const searchTimeoutRef = useRef(null);

  const searchContacts = async (search) => {
    try {
      if (search.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACT_ROUTE,
          { search },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchAllContacts(response.data.contacts);
          // console.log(searchAllContacts);
        }
      } else {
        setSearchAllContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectContact = async (contact) => {
    setUpNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchAllContacts([]);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchContacts(searchTerm);
    }, 500); // 500ms delay before sending a request
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="font-light text-neutral-300 text-opacity-90 text-sm cursor-pointer hover:text-neutral-100 transition-all duration-300"
              onClick={() => setUpNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>New contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setUpNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              All contacts
            </DialogTitle>
            <DialogDescription className="flex items-center justify-center">
              Please select a contact
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search contact"
              className="rounded-lg p-6 border-none bg-[#2c2e3b] focus:outline-none"
              onChange={handleSearchChange}
            />
           
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;

