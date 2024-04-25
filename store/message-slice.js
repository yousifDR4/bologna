import { createSlice } from "@reduxjs/toolkit";
const messageSlice = createSlice({
    name: "message",
    initialState: {
      showMessage:false,
      messageContent:"",
      severity:""
    },
    reducers: {
      setMessage(state, action) {
        console.log(action.payload);
        const payload = action.payload;
        state.showMessage=true;
        state.messageContent = payload.messageContent;
        state.severity=payload.severity ? payload.severity :"success";
      },
      hideMessage(state) {
        state.showMessage=false;
      },
    },
  });
  export default messageSlice;
export const messageActions = messageSlice.actions;