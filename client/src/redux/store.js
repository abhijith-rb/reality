import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './userReducer';
import chatReducer from './chatReducer';


export const store = configureStore({
  reducer:{
    user: userReducer,
    chat: chatReducer
  }
});
