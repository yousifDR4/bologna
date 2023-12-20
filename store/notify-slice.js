import { createSlice } from "@reduxjs/toolkit";
const notifySlice = createSlice({
    name: "notify",
    initialState: {
      notifications:[]
    },
    reducers: {
      setNotify(state, action) {
        const payload = action.payload;
        console.log(payload);
        state.notifications=payload;
      },
    },
  });
  export default notifySlice;
export const notifyActions = notifySlice.actions;