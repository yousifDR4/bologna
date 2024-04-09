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
  if (profile.role === "Professor") {
    const {
      name,
      accountType,
      uid,
      Department_id,
      College_id,
      Degree,
      University_id,
      city,
      describtion,
      email,
      sex,
      username,
      role,
      profilePicture,
      country
    } = profile;
    return async (dispatch) => {
      dispatch(authSlice.actions.logIn({ accountType:role, uid }));
      dispatch(
        profileActions.setProfile({
          name: name ? name : "",
          username:  username ?  username: "",
          email: email ? email : "",
          describtion: describtion ? describtion : "",
          profilePicture: profilePicture ? profilePicture : "",
          city: city ? city : "",
          University_id:University_id? University_id:"",
          College_id:College_id?College_id:"",
          Department_id:Department_id?Department_id:uid,
          role:role?role:"",
          Degree:Degree ? Degree:"",
          sex:sex?sex:"",
          country:country?country:"",

        })
      );
    };
  }
  if (profile.accountType === "student") {
    const {
      accountType,
      uid,
      email,
      departmentName,
      firstname,
      lastname,
      level,
      number,
      profilePicture,
      username,
      University_id,
      College_id,
      Department_id,
      sex,
      program,
    } = profile;
    return async (dispatch) => {
      console.log(profile);
      dispatch(authSlice.actions.logIn({ accountType, uid }));
      dispatch(
        profileActions.setProfile({
          firstname: firstname ? firstname : "",
          lastname:lastname?lastname:"",
          departmentName:departmentName?departmentName:"",
          number:number?number:"",
          username:  username ?  username: "",
          email: email ? email : "",
          profilePicture: profilePicture ? profilePicture : "",
          University_id:University_id? University_id:"",
          College_id:College_id?College_id:"",
          level:  level?  +level:"",
          Department_id:Department_id?Department_id:uid,
          sex:sex?sex:"",
          program:program?program:""
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