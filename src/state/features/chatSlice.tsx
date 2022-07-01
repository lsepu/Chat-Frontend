import { createSlice } from "@reduxjs/toolkit";

interface IHashMap {
  [key: string]: any[];
}

interface IChat {
  privateChats: IHashMap;
  publicChat: any[];
  channelChat: IHashMap;
  channelChatNames: string[];
  privateChatNames: string[];
}

const initialState: IChat = {
  privateChats: {},
  publicChat: [],
  channelChat: {},
  channelChatNames: [],
  privateChatNames: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChats: (state) => {
      state.privateChats = {};
      state.publicChat = [];
      state.channelChat = {};
      state.channelChatNames = [];
      state.privateChatNames = [];
    },
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

    joinChannel : (state, action) =>{
      console.log("ENTRE A CANAL");
      if(!state.channelChat[action.payload.name]){
        state.channelChat[action.payload.name] = [];
        state.channelChatNames.push(action.payload.name);
      }
    },

    addChannelMessage: (state, action) => {
      console.log("MANDE MENSAJE A CANAL")
      console.log(action.payload);
      state.channelChat[action.payload.payloadData.idReceiver].push(action.payload.payloadData);
    },

    initializeChannelChat: (state) => {
      state.channelChat["general"] = [];
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
  initializeChannelChat,
  joinChannel, addChannelMessage, clearChats
} = chatSlice.actions;
