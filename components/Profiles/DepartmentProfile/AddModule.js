import React, { useState, useEffect, useReducer, cloneElement } from "react";
import { auth, creatuser, db } from "../../../store/fire";
import classes from "./AddModule.module.css";
import { getIdToken } from "firebase/auth";
import { useSelector } from "react-redux";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const intilistate = {
  name: "",
  nametouched: false,
  describtion: "",
  describtiontouched: false,
  ECTS: "",
  ECTStouched: false,
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
        email: "",
        emailtouched: false,
        password: "",
        passwordtouched: false,
      };
    default:
  }
  return newstate;
}

const AddModule = (probs) => {

  const { course, level } = probs;
  const [state, dispatch] = useReducer(reducer, intilistate);
  const inputsValid = {
    describtion: state.describtion.trim() !== "",
    name: state.name.trim() !== "",
    ECTS: state.ECTS.trim() !== "",
  };
  const [formIsValid, setFormIsValid] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  useEffect(() => {
    if (inputsValid.describtion && inputsValid.ECTS && inputsValid.name) {
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
    dispatch(action);
  };

  function onchange(e) {
    const action = {
      type: "input",
      input: e.target.name,
      value: e.target.value,
    };
    dispatch(action);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    // course is variable indicating course number with values 1 or 2
    try{
    const info = {
      name: state.name,
      describtion: state.describtion,
      ECTS: state.ECTS,
      level: level,
      Deprartment_id: auth.currentUser.uid,
      course: course,
      University_id:profile.University_id,
      College_id:profile.College_id,
    };
    console.log();
    const id = await addDoc(collection(db, "subjects"), info);
    console.log(id.id);
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      subjects_id: arrayUnion(id.id),
    });
  }
  catch(e){
    console.log(e);
  }
  };
  return (
    <div className={`${classes.container} ${probs.className}`}>
      <form action="" className=" form">
        <h3>Add Module</h3>
        <label htmlFor="email">
          Module Name<span className={classes.star}>*</span>
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
          <p className={classes.errorText}>Module Name must be valid!</p>
        )}
        <label className="text">
          ECTS<span className={classes.star}>*</span>
        </label>
        <input
          name="ECTS"
          type="text"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.ECTS}
        />
        {!inputsValid.ECTS && state.ECTStouched && (
          <p className={classes.errorText}>Describtion must not be empty!</p>
        )}
        <label className="text">
          Decscribtion<span className={classes.star}>*</span>
        </label>
        <input
          name="describtion"
          type="text"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.describtion}
        />
        {!inputsValid.describtion && state.describtiontouched && (
          <p className={classes.errorText}>describtion must not be empty!</p>
        )}
        <div className={classes.button}>
          {" "}
          <button onClick={submitHandler} disabled={!formIsValid}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddModule;
