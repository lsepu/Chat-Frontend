import { createSlice } from "@reduxjs/toolkit";

interface IHashMap {
  [key: string]: any[];
}

interface IChat {
  privateChats: IHashMap;
  privateChatNames: string[]
}

const initialState: IChat = {
  privateChats: {},
  privateChatNames: []
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
      state.privateChats[action.payload.data.idSender] = action.payload.list;
      state.privateChatNames.push(action.payload.data.idSender);
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
    }
  },
});

export default chatSlice.reducer;

export const { createPrivateChat, addPrivateChatMessage, initializeChat, addOwnPrivateChatMessage } =
  chatSlice.actions;
