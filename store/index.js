import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import profileSlice from "./profile-slice";
const store=configureStore({
    reducer: {auth:authSlice.reducer,profile:profileSlice.reducer}
})
export default store;