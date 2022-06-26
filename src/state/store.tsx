import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./features/userSlice"

export const store=configureStore({
    reducer:{
        user: userReducer,
    },
})

type AppDispatch = typeof store.dispatch;

type stateType = ReturnType<typeof store.getState>;

export type { stateType, AppDispatch };

export default store