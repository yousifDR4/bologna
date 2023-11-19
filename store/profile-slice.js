import { createSlice } from "@reduxjs/toolkit";
import { auth } from "./fire";
const init={}
const profileSlice=createSlice({
    name:"profile",
    initialState:{profile:init},
    reducers:{
        setProfile(state,action){
            console.log("entereed");
            state.profile=action.payload;
            console.log(state.profile);
        },
        setProfileValue(state,action){
            const type=action.payload.type;
            const prevProfile=state.profile;
            state.profile={...prevProfile,[type]:action.payload.value}
            console.log(state.profile);

        },
        logOut(state){
            state.profile=init;
            console.log(state.profile);
        
        }
    }
});
export default profileSlice;
export const profileActions=profileSlice.actions;