import React, { useState, useEffect, useReducer, cloneElement } from "react";
import { auth, creatuser, db } from "../../../../store/fire";

import Select from "react-select";

import classes from "./AddProffessor.module.css";
import { getIdToken } from "firebase/auth";
import { useSelector } from "react-redux";
import {
  addDoc,
  arrayUnion,
  collection,

  count,

  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

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
  sex: "",
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

        sex: "",
        Degree: "",

      };
    default:
  }
  return newstate;
}

const AddProffessor = () => {
  const [state, dispatch] = useReducer(reducer, intilistate);

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
  useEffect(() => {

    console.log(inputsValid.Country);
    if (inputsValid.describtion && inputsValid.Country && inputsValid.name) {

      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [inputsValid]);

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
    // course is variable indicating course number with values 1 or 2

    try {
      const info = {
        "name": state.name,
        "email": state.email,
        "password": state.password,
        "accountType": "Department",
        "createType": "username",
        "role": "Proffessor", 
        "path": {
          "University_id": profile.University_id,
          "College_id": profile.College_id,
          "Department_id": auth.currentUser.uid},
        "pinfo": {
          "describtion": state.describtion,
          "Country": state.Country,
          "city": state.city,
          "sex": state.sex,
          "Degree": state.Degree}
      };
      
      console.log(info);
      await creatuser(info);
    } catch (e) {
      console.log(e);
    }

 

  };
  return (
    <div className={`${classes.container}`}>
      <form action="" className=" form">
        <h3>Add Module</h3>
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
            )}
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
              <option value="Master">Master </option>
              <option value="Doctoral">Doctoral</option>
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

            <label htmlFor="password">
              Password<span className={classes.star}>*</span>
            </label>
            <input
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
            <label htmlFor="email">
              Email<span className={classes.star}>*</span>
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

          <span></span>
          <span></span>

          <div className={classes.button}>
            {" "}
            <button
              onClick={submitHandler}
              disabled={!formIsValid && !uploading}
            >
              {uploading ? "Uploading" : "Add"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};
export default AddProffessor;
