/* eslint-disable no-unused-vars */
export const createContactSlice = (set, get) => ({
    // Chat state
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    friendList: [],
  
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
  