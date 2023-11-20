import { useEffect, useReducer, useState } from "react";
import { useDispatch } from 'react-redux';
import { authActions, onLogin } from "../../store/auth-slice";
import{auth, signin,userexist,valiedemail,signinWithUsername,getprofile} from "../../store/fire"
import { onAuthStateChanged ,GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence} from 'firebase/auth';
import classes from "./Login.module.css";
import googleicon from "../../Images/google.png"; 
import {  useNavigate } from "react-router-dom";
import { profileActions } from "../../store/profile-slice";
import Uob from "../../Images/UniversityofBaghdad.png";
import UobBanner from "../../Images/UoB_Tower.jpg";
const details="University of Baghdad is a public university in Baghdad. It's the largest university in Iraq and the tenth largest university in Arab world."
let x={name:"University of Baghdad",uid:"UoB",details:details,location:"Iraq, Baghdad",facebook:"UOB",instagram:"UOB",twitter:"UOB",website:"www.UOB.com",profilePicture:Uob,bannerPicture:UobBanner};
const intilistate = {
    emailaddress: "",
    emailaddresstouched: false,
    password: "",
    passwordtouched: false,
  };
  function reducer(state, action) {
    let newstate = {};
  
    switch (action.type) {
      case "touch":
        newstate = { ...state, [action.value]: true };
        break;
      case "input":
        newstate = { ...state, [action.input]: action.value };
        break;
      default:
    }
    return newstate;
  }

const Login=()=>{
    const [loginstate,setloginstate]=useState(false);
    const[useer,setuseer]=useState("");
    const [state, dispatch] = useReducer(reducer, intilistate);
    const dispatchRedux=useDispatch();
    const navigate=useNavigate();
    const inputsValid = {
        emailaddress: state.emailaddress.length > 0,
        password: state.password.length > 0,
    };

    
    function onChangeInput(e) {
        const action = {
          type: "input",
          input: e.target.name,
          value: e.target.value,
        };
        dispatch(action);
      }
      const blurHandler = (e) => {
        const action = {
          type: "touch",
          value: e.target.name + "touched",
        };
        dispatch(action);
    };
 

    const onSubmit=async (e)=>{ //emailAdress => state.emailaddress , password => state.password
      e.preventDefault(); 
      try {
        await setPersistence(auth, browserLocalPersistence);
        if (state.emailaddress.includes("@")){
        await signInWithEmailAndPassword(auth,state.emailaddress,state.password);
        const user=await getprofile(auth.currentUser);
        console.log(user);
        dispatchRedux(onLogin(user));
        navigate("/");
        }
          else{
            console.log(11);
        const {email} = await signinWithUsername(state.emailaddress);
          if (email !== null) {
              console.log('User email:', email);
          console.log("username:",state.emailaddress);
          const profile=await signInWithEmailAndPassword(auth,email,state.password)
          dispatchRedux(onLogin(profile));
          navigate("/");
                 return;
          }
          else {
              console.log('User not found');
          }
          }
      }
      catch(e){
        if(e.code==="auth/invalid-login-credentials")
        console.log("wrong email or password");
      setuseer("wrong email or password");
      }
      // try{
        
      //   const user=await getprofile(auth.currentUser);
      //   console.log(user); 
      //   dispatchRedux(onLogin(user));
      //   navigate("/");
      // }
      // catch(error){

      // }
    }
    const signInwithGoogle= async(e)=>{
      e.preventDefault();
      try{
      await setPersistence(auth, browserLocalPersistence);
      await signin();
      if(auth.currentUser===null){
        console.log("not register");
        return;
      }
      const k=await getprofile()
      console.log(k);
    dispatchRedux(onLogin(k));
      setloginstate(true);
      }
      catch(e){
        console.log(e);
      }
    }
   useEffect(()=>{
    if((auth.currentUser!==null)&& loginstate===true){
      console.log(11111);
    navigate("/")
    }
   },[loginstate])


    return (
        <div className={classes.container}>
        <form action="" className=" form">
          <h3>Login</h3>
          <label className="text">
            Username or Email<span className={classes.star}>*</span>
          </label>
          <input
            type="text"
            placeholder=""
            className="text"
            name="emailaddress"
            onChange={onChangeInput}
            onBlur={blurHandler}
            value={state.emailaddress}
          />
          {!inputsValid.emailaddress && state.emailaddresstouched && (
            <p className={classes.errorText}>Must not be empty!</p>
          )}
          <label className="text">
            Password<span className={classes.star}>*</span>
          </label>
          <input
            type="password"
            placeholder="more than 8 characters"
            className="text"
            name="password"
            onChange={onChangeInput}
            onBlur={blurHandler}
            value={state.password}
          />
         
          {!inputsValid.password && state.passwordtouched && (
            <p className={ classes.errorText}>Password must not be empty!</p>
          )}
          <div className={classes.button}>
            {" "}
            <button onClick={onSubmit} disabled={!inputsValid.emailaddress || !inputsValid.password}>Confirm</button>
          </div>
          <div className={classes.or}>
            or
          </div>
          <div className={classes.googlebtn}>
           <button onClick={signInwithGoogle}>
            <img src={googleicon} alt="google icon"/><p>  Sign in with Google</p>
           </button>
          </div>
        </form>
        <div className={classes.bttmtext}>
          <p>Only registered accounts can login.</p>
        </div>
      </div>
    );
}
export default Login;