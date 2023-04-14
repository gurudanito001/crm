import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import notificationMessagesReducer from './slices/notificationMessagesSlice';


export default configureStore({
  reducer: {
    user: userReducer,
    notificationMessages: notificationMessagesReducer,
  },
})