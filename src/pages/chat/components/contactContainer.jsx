/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ProfileInfo from "./profileComponent/profileInfo";
import NewMessage from "./messageComponents/newMessage";
import { apiClient } from "@/lib/apiClient";
import { GET_ALL_CONTACT_LIST_OF_FRIENDS_ROUTE, USER_CHANNELS_ROUTE } from "@/utills/const";
import { useStore } from "@/store/store";
import ContactList from "./contactComponent/contactList";
import CreateChannel from "./channelComponents/createChannel";

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-0 font-light text-opacity-90">
      {text}
    </h6>
  );
};

const ContactContainer = () => {
  // const [contacts, setContacts] = useState([]);
  const { friendList, setFriendList, channels, setChannels } = useStore()

  useEffect(() => {
    const getFriendsList = async () => {
      try {
        const response = await apiClient.get(
          GET_ALL_CONTACT_LIST_OF_FRIENDS_ROUTE,
          {
            withCredentials: true,
            // headers: { Authorization: `Bearer ${token}` }, // Correct format for headers
          }
        );
        if (response.data.contacts) {
          setFriendList(response.data.contacts);
          // console.log(response.data.contacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    const getChannels = async () => {
      try {
        const response = await apiClient.get(
          USER_CHANNELS_ROUTE,
          {
            withCredentials: true,
            // headers: { Authorization: `Bearer ${token}` }, // Correct format for headers
          }
        );
        if (response.data.channels) {
          setChannels(response.data.channels);
          // console.log(response.data.channels);
        }
      } catch (error) {
        console.log("Error fetching contacts:", error);
      }
    };
    getFriendsList();
    getChannels();
  }, [setFriendList, setChannels]);

  return (
    <section className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] border-r-2 text-white bg-[#1c1d25] border-[#2f303b] w-full">
      <div className="pt-3 flex items-center">
        <img
          src="/Logo.png"
          alt="Logo"
          className="h-[2.5rem] w-[2.5rem]] md:h-[2.5rem] md:w-[2.5rem]"
        />
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Chats" />
          <NewMessage />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={friendList} />
        </div>
      </div>
      {/* <div className="mt-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[72vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div> */}
      <div className="mt-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[72vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>

      <ProfileInfo />
    </section>
  );
};

export default ContactContainer;
