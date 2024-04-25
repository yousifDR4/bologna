import React, { useState, useEffect, useReducer, cloneElement } from "react";
import { auth, creatuser, db } from "../../../../store/fire";
import person from "../../../../Images/user.png";
import Select from "react-select";

import classes from "./AddProffessor.module.css";
import { getIdToken } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  addDoc,
  arrayUnion,
  collection,

  count,

  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { setreport } from "../../../../store/getandset";
import { useLocation } from "react-router-dom";
import { profileActions } from "../../../../store/profile-slice";
import { displayMessage } from "../../../../store/message-slice";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const intilistate = {
  name: "",
  nametouched: false,
  describtion: "",
  describtiontouched: false,
  ECTStouched: false,
  Country: "",
  Countrytouched: false,
  city: "",
  citytouched: false,
  Degree: "",
  sex: "male",
  password: "",
  passwordtouched: false,
  email: "",
  emailtouched: false,
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
    case "reset":
      newstate = {
        name: "",
        nametouched: false,
        describtion: "",
        describtiontouched: false,
        password: "",
        passwordtouched: false,
        email: "",
        emailtouched: false,
        Country: "",
        Countrytouched: false,
        city: "",
        citytouched: false,
        codetouched: false,

        sex: "male",
        Degree: "",

      };
      case "untouch":
        newstate = { ...state, [action.value]: false };
    default:
  }
  return newstate;
}

const EditProffessor = (probs) => {
  const {initialValues,open,handleClose}=probs;
  console.log(initialValues);
  const [state, dispatch] = useReducer(reducer, intilistate);
  const dispatchRedux=useDispatch();
  const location=useLocation();
  const [uploading, setUploading] = useState(false);
  const inputsValid = {
    describtion: state.describtion.trim() !== "",
    name: state.name.trim() !== "",
    password: state.password.trim() !== "",
    city: state.city.trim() !== "",
    Country: state.Country.trim() !== "",
    email: state.email.trim() !== "",

  };
  const [formIsValid, setFormIsValid] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id=profile.Department_id;
  useEffect(() => {
    if (inputsValid.describtion && inputsValid.Country && inputsValid.name && inputsValid.email && inputsValid.password) {
      console.log("Hh");
      setFormIsValid(true);
    } else {
      console.log("@2");
      setFormIsValid(false);
    }
  }, [inputsValid]);

useEffect(() => {
    function mapData(object,input){
        console.log(object,input);
        const action={
               type:"input",
               input:input,
               value :object
             }
            dispatch(action);
            const action2={
              type:"untouch",
              input:input,
            }
           dispatch(action2);
        }
        const objectMap = (obj, fn) =>
        Object.fromEntries(
          Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
          )
        )
        let localObject={
            name:initialValues.name || "",
            describtion: initialValues.describtion || "",
            Country: initialValues.Country || "",
            city: initialValues.city || "",
            Degree: initialValues.Degree || "",
            sex: initialValues.sex || "male",
            email: initialValues?.username ? initialValues.username : initialValues.email || "",
        }
        if (open) {
            objectMap(localObject,mapData);
        }
}, [initialValues]);

  const blurHandler = (e) => {
    const action = {
      type: "touch",
      value: e.target.name + "touched",
    };
    console.log(action);
    dispatch(action);
  };

  function onchange(e) {
    const action = {
      type: "input",
      input: e.target.name,
      value: e.target.value,
    };
    console.log(action);
    dispatch(action);
  }

  function onselect(input, obj) {
    let value = state.prerequisite;
    console.log(value);
    console.log(obj);
    obj.map((obj) => {
      if (!value.includes(obj.value)) {
        value.push(obj.value);
      }


    });
    const action = {
      type: "input",
      input: input,
      value: value,
    };
    console.log(action);
    dispatch(action);
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    // initialValues.id -> professor id
    setUploading(true);
    try {
    

        // dispatchRedux(profileActions.addOnProfileProfessors({value:res.uid}));
        // const reportinfo={
        //   page:location.pathname,
        //   type:"create",
        //   id:res.uid,
        //   uid:auth.currentUser.uid,
        //   name:profile.name,
        //   describtion:"create Proffessor accout",
        //   Department_id:Department_id,
        //   seen:[]
        // }
    //    await setreport(reportinfo,Department_id);
    dispatchRedux(displayMessage("Account was created succesfully!","success"));
        const action = {
      type: "reset",
       };
    dispatch(action);
      } catch (e) {
      console.log(e);
      setUploading(false);
      dispatchRedux(displayMessage("An error occurred!","error"));
    }
   finally{
    setUploading(false);
   }

 

  };
  return (
    <Dialog
    open={open}
    onClose={handleClose}
    fullWidth
    maxWidth
    >
    <DialogTitle>Edit Professor</DialogTitle>
        <DialogContent>
    <div className={`${classes.container}`}>
      <form action="" className={classes.noShadow}>
        <div className={classes.fields}>
          <span>

            <label htmlFor="email">
              Name<span className={classes.star}>*</span>
            </label>
            <input
              type="text"
              placeholder=""
              name="name"
              id="name"
              onChange={onchange}
              onBlur={blurHandler}
              value={state.name}
            />
            {!inputsValid.name && state.nametouched && (
              <p className={classes.errorText}>Name must be valid!</p>
            )}
          </span>
          <span>
            <label className="text">
              Decscribtion<span className={classes.star}>*</span>
            </label>
            <input
              name="describtion"
              type=""
              onChange={onchange}
              onBlur={blurHandler}
              value={state.describtion}
            />
            {!inputsValid.describtion && state.describtiontouched && (
              <p className={classes.errorText}>
                describtion must not be empty!
              </p>
            )}
          </span>
          <span>
            <label className="text">
              Country<span className={classes.star}>*</span>
            </label>
            <input
              name="Country"
              type=""
              onChange={onchange}
              onBlur={blurHandler}
              value={state.Country}
            />
            {!inputsValid.Country && state.Countrytouched && (
              <p className={classes.errorText}>Country must not be empty!</p>
            )}
            </span>
            <span>
            <label className="text">
              City<span className={classes.star}>*</span>
            </label>
            <input
              name="city"
              type=""
              onChange={onchange}
              onBlur={blurHandler}
              value={state.city}
            />
            {!inputsValid.city && state.citytouched && (
              <p className={classes.errorText}>city must not be empty!</p>
            )}</span>
            <span>
            <label className="text">
              Degree <span className={classes.star}>*</span>
            </label>
            <select
              name="Degree"
              type=""
              onChange={onchange}
              onBlur={blurHandler}
              value={state.Degree}
            >
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master </option>
              <option value="Doctorate">Doctorate</option>
            </select>
          </span>
          <span>
            <label className="text">
              sex <span className={classes.star}>*</span>
            </label>
            <select
              name="sex"
              type=""
              onChange={onchange}
              onBlur={blurHandler}
              value={state.Degree}
            >
              <option value="male">male </option>
              <option value="female">female</option>
            </select>
            </span>
              <span>
            <label htmlFor="password">
              Password<span className={classes.star}>*</span>
            </label>
            <input
            disabled
              type="password"
              placeholder=""
              name="password"
              id="password"
              onChange={onchange}
              onBlur={blurHandler}
              value={state.password}
            />
            {!inputsValid.password && state.passwordtouched && (
              <p className={classes.errorText}>Password must be valid!</p>
            )}
            </span>
            <span>
            <label htmlFor="email">
              Email or Username<span className={classes.star}>*</span>
            </label>
            <input

              type="email"
              placeholder=""
              name="email"
              id="email"
              onChange={onchange}
              onBlur={blurHandler}
              value={state.email}
            />
            {!inputsValid.email && state.emailtouched && (
              <p className={classes.errorText}>Password must be valid!</p>
            )}
          </span>

         

          <div className={classes.button}>
            {" "}
            <button
              onClick={submitHandler}
              disabled={!formIsValid || uploading}

            >
              {uploading ? "Uploading" : "Add"}
            </button>
          </div>

        </div>
      </form>
    </div>
    </DialogContent>
    </Dialog>
  );
};
export default EditProffessor;
