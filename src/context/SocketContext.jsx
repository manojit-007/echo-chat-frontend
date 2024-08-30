/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { useStore } from "@/store/store";
import { HOST } from "@/utills/const";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// export default SocketContext;

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect", () => {
        console.log("Connected to the socket server");
      });

      const handleReceiveMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage } =
          useStore.getState();
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.receiver._id)
        ) {
          addMessage(message);
          // console.log("message received from server", message);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
