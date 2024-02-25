import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "./profile-slice";
import { auth } from "./fire";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: false,
    accountType: null,
    uid: null,
  },
  reducers: {
    logIn(state, action) {
      const payload = action.payload;
      state.loggedIn = true;
      state.accountType = payload.accountType;
      state.uid = payload.uid;
    },
    logOut(state) {
      state.loggedIn = false;
      state.accountType = null;
      state.uid = null;
      auth.signOut();
    },
  },
});
export const onLogin = (profile) => {
  console.log(profile.accountType, 111111111);
  if (profile.accountType === "University") {
    const {
      name,
      accountType,
      uid,
      email,
      details,
      website,
      facebook,
      instagram,
      twitter,
      profilePicture,
      bannerPicture,
      location,
      Colleges_id,
      username,
      University_id
    } = profile;
    return async (dispatch) => {
      dispatch(authSlice.actions.logIn({ accountType, uid }));
      dispatch(
        profileActions.setProfile({
          name: name ? name : "",
          username:  username ?  username : "",
          email: email ? email : "",
          details: details ? details : "",
          website: website ? website : "",
          facebook: facebook ? facebook : "",
          instagram: instagram ? instagram : "",
          twitter: twitter ? twitter : "",
          profilePicture: profilePicture ? profilePicture : "",
          bannerPicture: bannerPicture ? bannerPicture : "",
          location: location ? location : "",
          Colleges_id: Colleges_id ? Colleges_id : [],
          University_id:University_id?University_id:uid,
        })
      );
    };
  }
  if (profile.accountType === "College") {
    const {
      name,
      accountType,
      uid,
      email,
      details,
      website,
      facebook,
      instagram,
      twitter,
      profilePicture,
      bannerPicture,
      location,
      Department_id,
      username,
      University_id,
      College_id,
    } = profile;
    return async (dispatch) => {
      dispatch(authSlice.actions.logIn({ accountType, uid }));
      dispatch(
        profileActions.setProfile({
          name: name ? name : "",
          username:  username ?  username : "",
          email: email ? email : "",
          details: details ? details : "",
          website: website ? website : "",
          facebook: facebook ? facebook : "",
          instagram: instagram ? instagram : "",
          twitter: twitter ? twitter : "",
          profilePicture: profilePicture ? profilePicture : "",
          bannerPicture: bannerPicture ? bannerPicture : "",
          location: location ? location : "",
          Department_id: Department_id ? Department_id : [],
          University_id:University_id?University_id:[],
          College_id:College_id?College_id:uid,
      
        })
      );
    };
  }
  if (profile.accountType === "Department") {
    const {
      name,
      accountType,
      uid,
      Department_id,
      email,
      details,
      website,
      facebook,
      instagram,
      twitter,
      profilePicture,
      bannerPicture,
      location,
      username,
      University_id,
      College_id,
      levels,
      professors,
      specialities,
      role
    } = profile;
    return async (dispatch) => {
      dispatch(authSlice.actions.logIn({ accountType, uid }));
      dispatch(
        profileActions.setProfile({
          name: name ? name : "",
          username:  username ?  username: "",
          email: email ? email : "",
          details: details ? details : "",
          website: website ? website : "",
          facebook: facebook ? facebook : "",
          instagram: instagram ? instagram : "",
          twitter: twitter ? twitter : "",
          profilePicture: profilePicture ? profilePicture : "",
          bannerPicture: bannerPicture ? bannerPicture : "",
          location: location ? location : "",
          University_id:University_id? University_id:"",
          College_id:College_id?College_id:"",
          levels:  levels?  levels:[],
          professors:professors?professors:[],
          Department_id:Department_id?Department_id:uid,
          specialities:specialities?specialities:[],
          role:role?role:[]
        })
      );
    };
  }
  if (profile.accountType === "Admin") {
    const { accountType, uid, email } = profile;
    return async (dispatch) => {
      dispatch(authSlice.actions.logIn({ accountType, uid }));
      dispatch(profileActions.setProfile({ email: email ? email : "" }));
    };
  }
};
export default authSlice;
export const authActions = authSlice.actions;
export const selectuid = (state) => state.auth.uid;