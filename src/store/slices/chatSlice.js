/* eslint-disable no-unused-vars */
export const createChatSlice = (set, get) => ({
    // Chat state
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    friendList: [],
    
    channels: [],
    setChannels: (channels) => set({channels}),
    addChannel: (channels) => {
      set({ channels: [...get().channels, channels] });
    },
    addChannelToChannelList: (message) => {
      const channels = get().channels;
      const data = channels.find((channel) => channel._id === message.channelId);
      const index = channels.findIndex(ch => ch._id === message.channelId);
      if(index !== -1 && index !== undefined) {
        channels.splice(index, 1);
        channels.unshift(data);
      }
    },
    removeChannel: (channel) => {
      const channels = get().channels.filter((c) => c._id!== channel._id);
      set({ channels });
    },
    
    // Upload/Download state
    uploadingStatus: false,
    setUploadingStatus: (uploadingStatus) => set({ uploadingStatus }),
  
    downloadProgress: 0,
    setDownloadProgress: (downloadProgress) => set({ downloadProgress }),
  
    downloadingStatus: false,
    setDownloadingStatus: (downloadingStatus) => set({ downloadingStatus }),
  
    uploadProgress: 0,
    setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  
    // Chat selection state
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  
    // Friend list state
    setFriendList: (friendList) => set({ friendList }),
  
    // Chat messages state
    sstSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
  
    // Function to reset chat state
    closeChat: () => set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),
  
    // Function to add a message
    addMessage: (message) => {
      const selectedChatMessages = get().selectedChatMessages;
      const selectedChatType = get().selectedChatType;
  
      set({
        selectedChatMessages: [
          ...selectedChatMessages,
          {
            ...message,
            receiver: selectedChatType === "channel" ? message.receiver : message.receiver,
            sender: selectedChatType === "channel" ? message.sender : message.sender._id,
          },
        ],
      });
    },
  });
  