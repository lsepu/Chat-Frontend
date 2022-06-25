import {configureStore} from "@reduxjs/toolkit"
import loggedInReducer from '../features/loggedInSlice'
export const store=configureStore({
    reducer:{
        logged: loggedInReducer,
    },
})

export default store