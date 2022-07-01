import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { stateType } from "../store";

export type userType = {
  //Usuario
  id?: string;
  userName: string;
  email: string;
  contacts: string[];
  isLogged: boolean;
  ipAddress: string;
};

interface userState extends userType {}

export enum userFetchStatus {
  IDLE = "idle",
  COMPLETED = "completed",
  FAILED = "failed",
  PENDING = "pending",
}

const initialState: IUser = {
  user: {
    id: "",
    userName: "",
    email: "",
    contacts: [],
    isLogged: false,
    ipAddress: "",
  },
  logged: false,
  status: userFetchStatus.IDLE,
  error: null,
};

interface IUser {
  user: userState;
  logged: boolean;
  status: userFetchStatus;
  error: string | null;
}

export const getUser = createAsyncThunk(
  "getUser",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://realtime-chat-app-sofkau.herokuapp.com/user/userEmail/${email}`
      );
      if (!response.ok) {
        return rejectWithValue(response.status);
      }
      return (await response.json()) as userType;
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      return rejectWithValue(message);
    }
  }
);

export const postUser = createAsyncThunk(
  "postUser",
  async (newUser: userType) => {
    const response = await fetch(
      "https://realtime-chat-app-sofkau.herokuapp.com/user",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(newUser),
      }
    );
    return (await response.json()) as userType;
  }
);

export const updateUser = createAsyncThunk(
  "updateUser",

  async (user: userType) => {

    const response = await fetch(
      `https://realtime-chat-app-sofkau.herokuapp.com/user`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(user),
      }
    );

    return (await response.json()) as userType;

  }
);

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
  extraReducers: (builder) => {
    //get
    builder.addCase(getUser.pending, (state, action) => {
      state.status = userFetchStatus.PENDING;
    });

    builder.addCase(getUser.fulfilled, (state, action) => {
      state.status = userFetchStatus.COMPLETED;
      state.user = action.payload;
      state.logged = action.payload.isLogged;
    });

    builder.addCase(getUser.rejected, (state, action) => {
      state.status = userFetchStatus.FAILED;
      state.error = "Something went wrong while fetching";
    });

    //post
    builder.addCase(postUser.pending, (state) => {
      state.status = userFetchStatus.PENDING;
    });

    builder.addCase(postUser.fulfilled, (state, action) => {
      state.status = userFetchStatus.COMPLETED;
      state.user = action.payload;
      state.logged = action.payload.isLogged;
    });

    builder.addCase(postUser.rejected, (state) => {
      state.status = userFetchStatus.FAILED;
      state.error = "Something went wrong while fetching";
    });

    //put
    builder.addCase(updateUser.pending, (state) => {
      state.status = userFetchStatus.PENDING;
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      

      state.status = userFetchStatus.COMPLETED;
      state.user = action.payload;
      state.logged = action.payload.isLogged;


    });

    builder.addCase(updateUser.rejected, (state) => {

      state.status = userFetchStatus.FAILED;
      state.error = "Something went wrong while fetching";
    });
  },
});

export default userSlice.reducer;

export const { login, logout } = userSlice.actions;
export const selectUserStatus = () => (state: stateType) => state.user.status;
export const selectUser = () => (state: stateType) => state.user.user;
export const selectUserLogged = () => (state: stateType) => state.user.logged;
export const selectUserError = () => (state: stateType) => state.user.error;
