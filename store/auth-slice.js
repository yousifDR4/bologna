import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "./profile-slice";
import { auth } from "./fire";
const authSlice=createSlice({
    name:'auth',
    initialState:{
        loggedIn:false,
        accountType:null,
        uid:null
    },
    reducers:{
        logIn(state,action){
            const payload=action.payload;
            state.loggedIn=true;
            state.accountType= payload.accountType;
            state.uid= payload.uid;
        },
        logOut (state){
            state.loggedIn=false;
            state.accountType= null;
            state.uid=null;
            auth.signOut();
        }
    }
});
export const onLogin=(profile)=>{
    if(profile.accountType==="University"){
    const {name,accountType,uid,email, details ,website,facebook,instagram,twitter,profilePicture,bannerPicture,location,Colleges_id}=profile;
    return async (dispatch)=>{
    dispatch(authSlice.actions.logIn({accountType,uid}));
    dispatch(profileActions.setProfile({name:name?name:"",email:email?email:"",details:details?details:"",website:website?website:"",facebook:facebook?facebook:"",instagram:instagram?instagram:"",twitter:twitter?twitter:"",profilePicture:profilePicture?profilePicture:"",bannerPicture:bannerPicture?bannerPicture:"",location:location?location:"",Colleges_id:Colleges_id?Colleges_id:[]}));
}
}

}
export default authSlice;
export const authActions=authSlice.actions;
export const selectuid=(state)=> state.auth.uid


