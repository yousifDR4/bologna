import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import profileSlice from "./profile-slice";
import errorSlice from "./error-slice";
const store=configureStore({
    reducer: {auth:authSlice.reducer,profile:profileSlice.reducer,error:errorSlice.reducer}
})
export default store;