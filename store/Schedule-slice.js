import { createSlice } from "@reduxjs/toolkit";
const  initialState= {
    "Sunday":{show:false},
    "Monday":{show:false},
    "Tuesday":{show :false},
    "Wednesday":{show:false},
    "Thursday":{show:false},
    "Saturday":{show :false},
}
const Scheduleslice = createSlice({
    name: "days",
    initialState: initialState,
    
    reducers: {
      setDays(state, action) {
        const payload = action.payload;
        console.log(payload);
        state=payload;
      },
      setOneDay(state, action) {
        console.log(state);
        state[action.payload.name].show=true;
      },
      rest(state, action) {
        state[action.payload.name].show=false;
      }
    },
  });
  export default Scheduleslice;
export const notifyActions = Scheduleslice.actions;