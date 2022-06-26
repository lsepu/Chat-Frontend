import { createSlice } from "@reduxjs/toolkit";

interface userState {
  userName: String;
  email: String;
  contacts: String[];
}

interface IUser {
  user: userState | null;
  logged: boolean;
}

const initialState: IUser = {
  user: null,
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

export const { login, logout } = userSlice.actions;
