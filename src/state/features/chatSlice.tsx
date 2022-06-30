import { createSlice } from "@reduxjs/toolkit";

interface IHashMap {
  [key: string]: any[];
}

interface IChat {
  privateChats: IHashMap;
  publicChat: any[];
  privateChatNames: string[];
}

const initialState: IChat = {
  privateChats: {},
  publicChat: [],
  privateChatNames: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    initializeChat: (state, action) => {
      state.privateChats[action.payload.email] = [];
      state.privateChatNames.push(action.payload.email);
    },
    createPrivateChat: (state, action) => {
      if (!state.privateChats[action.payload.data.idSender]) {
        state.privateChats[action.payload.data.idSender] = action.payload.list;
        state.privateChatNames.push(action.payload.data.idSender);
      } else {
        state.privateChats[action.payload.data.idSender].push(
          action.payload.data
        );
      }
    },
    addPrivateChatMessage: (state, action) => {
      state.privateChats[action.payload.data.idSender].push(
        action.payload.data
      );
    },
    addOwnPrivateChatMessage: (state, action) => {
      state.privateChats[action.payload.data.idReceiver].push(
        action.payload.data
      );
    },
    addPublicChatMessage: (state, action) => {
      state.publicChat.push(action.payload.message);
    },
    getChatHistory: (state, action) => {
      state.privateChats[action.payload.email] = [];
      console.log(action.payload)
      action.payload.chats.map((chat: any) => {
        state.privateChats[action.payload.email].push(chat);
      });
      if(!state.privateChatNames.includes(action.payload.email)){
        state.privateChatNames.push(action.payload.email);
      }
    },
  },
});

export default chatSlice.reducer;

export const {
  createPrivateChat,
  addPrivateChatMessage,
  initializeChat,
  addOwnPrivateChatMessage,
  addPublicChatMessage,
  getChatHistory,
} = chatSlice.actions;
