import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import profileSlice from "./profile-slice";
import errorSlice from "./error-slice";
import notifySlice from "./notify-slice";
import Scheduleslice from "./Schedule-slice";
import messageSlice from "./message-slice";
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    profile: profileSlice.reducer,
    error: errorSlice.reducer,
    notify: notifySlice.reducer,
    days: Scheduleslice.reducer,
    message:messageSlice.reducer,
  },
});
export default store;
