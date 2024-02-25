import React, { useState, useEffect, useReducer, cloneElement } from "react";
import { auth, creatuser, db } from "../../../../../store/fire";
import Select from "react-select";
import classes from "./ModuleInfo.module.css";
import { getIdToken } from "firebase/auth";
import { useSelector } from "react-redux";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { get_Subjects, get_Sujects, get_classRooms, get_prof, get_prog, get_progs } from "../../../../../store/getandset";
import { stringifyNumber } from "../../LevelModule";

const ModuleTheory = (probs) => {
  let { form, setForm, setFormIsValid } = probs;
  const inputsValid =   //creating dynamic object
    Object.fromEntries(
        Array.from({ length: 15 }, (_, index) => [`week${index + 1}T`, form[`week${index + 1}T`]?.length > 0 || false])
      ) ;
console.log(inputsValid);
  useEffect(() => {
    if ( Object.values(inputsValid).every((value) => value)) { //checking all validations
      setFormIsValid((prev)=> {return{...prev ,"MTheor":true}});
      console.log("trueeeeeeee");
    } else {
      setFormIsValid((prev)=> {return{...prev ,"MTheor":false}});
      console.log("false");
    }
  }, [inputsValid,form]);

  function onchange(e) {
    console.log(e.target.name);
    setForm((prev) => {
      console.log(prev);
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  return (
    <div className={`${classes.container}`}>
      <form action="" className=" form">
        <div className={classes.fields}>
        {Array.from({ length: 15 }, (_, index) => index + 1).map((i) => ( //creating dynamic fields fiftenth times
      <span key={i}>
        <label className="text">
          {`${stringifyNumber(i)} Week`}
        </label>
        <input
          name={`week${i}T`}
          type="text"
          onChange={onchange}
          value={form[`week${i}T`] || ""}
        />
      </span>
    ))}
        </div>
      </form>
    </div>
  );
};
export default ModuleTheory;
