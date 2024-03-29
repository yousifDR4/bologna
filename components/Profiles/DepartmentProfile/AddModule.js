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
import { useLocation } from "react-router-dom";
import { setreport } from "../../../store/getandset";

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
        describtion: "",
        describtiontouched: false,
        ECTS: "",
        ECTStouched: false,
      };
    default:
  }
  return newstate;
}

const AddModule = (probs) => {
  const location = useLocation();
  const { course, level } = probs;
  const [state, dispatch] = useReducer(reducer, intilistate);
  const inputsValid = {
    describtion: state.describtion.trim() !== "" ,
    name: state.name.trim() !== "",
    ECTS: state.ECTS.trim() !== "",
  };
  const [formIsValid, setFormIsValid] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
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
      Deprartment_id: Department_id,
      course: course,
      University_id:profile.University_id,
      College_id:profile.College_id,
    };
    console.log();
    const id = await addDoc(collection(db, "subjects"), info);
    console.log(id.id);
    const update= updateDoc(doc(db, "users", Department_id), {
      subjects_id: arrayUnion(id.id),
    });
    const reportinfo={
      page:location.pathname,
      type:"add",
      id:id.id,
      uid:auth.currentUser.uid,
      name:profile.name,
      describtion:"add a module"
    }
    Promise .all([setreport(reportinfo,Department_id),update])
  }
  catch(e){
    console.log(e);
  }
  probs.showAddModule(false);
  probs.setReload((prev)=>!prev);
  const action={
    type:"reset"
  };
  dispatch(action);
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
        <textarea
          name="describtion"
          type=""
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
