import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null
}

const loggedInSlice = createSlice(
  {
    name: 'logged',
    initialState,
    reducers:{
      logInInReducer(state, action){
        return {...state, user: action.payload}
      },
      logOutInReducer(){
        return {user: null}
      }
    }
  }
)


export default loggedInSlice.reducer

export const {logInInReducer, logOutInReducer} = loggedInSlice.actions