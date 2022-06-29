import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./features/userSlice"
import channelReducer from "./features/channelSlice"
export const store=configureStore({
    reducer:{
        user: userReducer,
        channels:channelReducer,
    },
})

export type AppDispatch = typeof store.dispatch;
export type stateType = ReturnType<typeof store.getState>;
export default store