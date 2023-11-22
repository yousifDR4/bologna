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
    console.log(profile.accountType,111111111);
    if(profile.accountType==="University"){
    const {name,accountType,uid,email, details ,website,facebook,instagram,twitter,profilePicture,bannerPicture,location,Colleges_id,userName}=profile;
    return async (dispatch)=>{
    dispatch(authSlice.actions.logIn({accountType,uid}));
    dispatch(profileActions.setProfile({name:name?name:"",userName:userName?userName:"",email:email?email:"",details:details?details:"",website:website?website:"",facebook:facebook?facebook:"",instagram:instagram?instagram:"",twitter:twitter?twitter:"",profilePicture:profilePicture?profilePicture:"",bannerPicture:bannerPicture?bannerPicture:"",location:location?location:"",Colleges_id:Colleges_id?Colleges_id:[]}));
}
}
if(profile.accountType==="College"){
    const {name,accountType,uid,email,University_id, details ,website,facebook,instagram,twitter,profilePicture,bannerPicture,location,Departments_id,userName}=profile;
    return async (dispatch)=>{
    dispatch(authSlice.actions.logIn({accountType,uid}));
    dispatch(profileActions.setProfile({name:name?name:"",userName:userName?userName:"",email:email?email:"",University_id:University_id?University_id:"",details:details?details:"",website:website?website:"",facebook:facebook?facebook:"",instagram:instagram?instagram:"",twitter:twitter?twitter:"",profilePicture:profilePicture?profilePicture:"",bannerPicture:bannerPicture?bannerPicture:"",location:location?location:"",Departments_id:Departments_id?Departments_id:[]}));
}
}
if(profile.accountType==="Department"){
    const {name,accountType,uid,email, details ,website,facebook,instagram,twitter,profilePicture,bannerPicture,location,userName}=profile;
    return async (dispatch)=>{
    dispatch(authSlice.actions.logIn({accountType,uid}));
    dispatch(profileActions.setProfile({name:name?name:"",userName:userName?userName:"",email:email?email:"",details:details?details:"",website:website?website:"",facebook:facebook?facebook:"",instagram:instagram?instagram:"",twitter:twitter?twitter:"",profilePicture:profilePicture?profilePicture:"",bannerPicture:bannerPicture?bannerPicture:"",location:location?location:""}));
}
}
if(profile.accountType==="Admin"){
    const {accountType,uid,email}=profile;
    return async (dispatch)=>{
    dispatch(authSlice.actions.logIn({accountType,uid}));
    dispatch(profileActions.setProfile({email:email?email:""}));
}
}

}
export default authSlice;
export const authActions=authSlice.actions;
export const selectuid=(state)=> state.auth.uid


