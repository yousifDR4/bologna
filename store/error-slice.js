import { createSlice } from "@reduxjs/toolkit";
const errorSlice = createSlice({
    name: "error",
    initialState: {
      showError:false,
      title:"",
      message:""
    },
    reducers: {
      setError(state, action) {
        const payload = action.payload;
        state.showError=true;
        state.title = payload.title;
        state.message = payload.message;
      },
      hideError(state) {
        state.showError=false;
        state.title="";
        state.message="";
      },
    },
  });
  export default errorSlice;
export const errorActions = errorSlice.actions;