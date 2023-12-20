import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import profileSlice from "./profile-slice";
import errorSlice from "./error-slice";
import notifySlice from "./notify-slice";
const store=configureStore({
    reducer: {auth:authSlice.reducer,profile:profileSlice.reducer,error:errorSlice.reducer,notify:notifySlice.reducer}
})
export default store;