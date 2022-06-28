import { createSlice } from "@reduxjs/toolkit";

interface userState {
  email: string;
  contacts: string[];
}

interface IUser {
  user: userState;
  logged: boolean;
}

const initialState: IUser = {
  user: {
    email: "",
    contacts: [""],
  },
  logged: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.logged = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.logged = false;
    },
  },
});

export default userSlice.reducer;

export const { login, logout, } = userSlice.actions;
