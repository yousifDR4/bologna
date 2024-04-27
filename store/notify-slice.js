import { createSlice } from "@reduxjs/toolkit";
const notifySlice = createSlice({
    name: "notify",
    initialState: {
      notifications:[],
      noNotification:0
    },
    reducers: {
      setNotify(state, action) {
        const payload = action.payload;
        console.log(payload);
        state.notifications=payload;
      },
      setNotificationsNumber(state, action) {
        const payload = action.payload.no;
        state.noNotification=payload;
      },
      AddonNotify(state, action) {
       
        state.noNotification=state.noNotification+1;
      },
    },
  });
  export default notifySlice;
export const notifyActions = notifySlice.actions;