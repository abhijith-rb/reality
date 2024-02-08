import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './userReducer';
import chatReducer from './chatReducer';
import tokenReducer from './accessTokenReducer'
import storage from 'redux-persist/lib/storage';
import {persistStore, persistReducer} from "redux-persist"

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  token: tokenReducer
})

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store)
