import React, { useState, useEffect, useReducer, cloneElement } from "react";
import { auth, creatuser, db } from "../../../../store/fire";
import book from "../../../../Images/book.png";
import Select from 'react-select'
import classes from "./AddNewModule.module.css";
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
import {get_Sujects} from"../../../../store/getandset";
let modul=[
  { value: 'physics', label: 'Physics' },
  { value: 'mathII', label: 'MathII' },
  { value: 'humanrights', label: 'Human Rights' }
]

const intilistate = {
  name: "",
  nametouched: false,
  describtion: "",
  describtiontouched: false,
  ECTS: "",
  ECTStouched: false,
  code:"",
  codetouched:false,
  language:"english",
  lastExamHours:"",
  lastExamHourstouched:false,
  midtermHours:"",
  midtermHourstouched:false,
  type:"",
  typetouched:false,
  prerequisite:[],
  corequisites:[]
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
        code:"",
        codetouched:false,
        language:"",
        languagetouched:false,
        lastExamHours:"",
        lastExamHourstouched:false,
        midtermHours:"",
        midtermHourstouched:false,
        type:"",
        typetouched:false,
        corequisites:[],
        prerequisite:[],

      };
    default:
  }
  return newstate;
}

const AddNewModule = () => {

  const [modules,setModules]=useState(modul)

  const [state, dispatch] = useReducer(reducer, intilistate);
  const [uploading,setUploading]=useState(false);
  const inputsValid = {
    describtion: state.describtion.trim() !== "" ,
    name: state.name.trim() !== "",
    ECTS: state.ECTS > 0,
    code: state.code.trim() !== "",
    midtermHours: state.midtermHours > 0,
    lastExamHours:state.lastExamHours > 0,
    type:state.type.trim() !== ""
  };
  const [formIsValid, setFormIsValid] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  useEffect(() => {
    if (inputsValid.describtion && inputsValid.ECTS && inputsValid.name && inputsValid.code && inputsValid.lastExamHours && inputsValid.midtermHours && inputsValid.type) {
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
  function onselect(input,obj){
    let value= state.prerequisite;
    console.log(value);
    console.log(obj);
    obj.map((obj)=>{
      if(!value.includes(obj.value)){
      value.push(obj.value)}
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
    setUploading(true);
    // course is variable indicating course number with values 1 or 2
    try{
    const info = {
      name: state.name,
      describtion: state.describtion,
      ECTS: state.ECTS,
      code: state.code,
      language:state.language,
      midTermHours:state.midtermHours,
      endTermHours:state.lastExamHours,
      type:state.type,
      Deprartment_id: auth.currentUser.uid,
      University_id:profile.University_id,
      College_id:profile.College_id,
      prerequisite:state.prerequisite,
      corequisites:state.corequisites,
    };
    console.log();
    const id = await addDoc(collection(db, "subjects"), info);
    console.log(id.id);
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      subjects_id: arrayUnion(id.id),
    });
    setUploading(false);
  }
  catch(e){
    setUploading(false);
    console.log(e);
  }
 
  const action={
    type:"reset"
  };
  dispatch(action);
  };
useEffect(()=>{
  if (!auth.currentUser)
  return; 
  console.log("NNNN");
const f=async()=>{
  const a=await get_Sujects();
  setModules(a);
  console.log(a,"a");
}
f();
},[auth.currentUser])


  return (
    <div className={`${classes.container}`}>
      <form action="" className=" form">
        <h3> <img src={book} alt=""/> Add a new  module</h3>
        <div className={classes.fields}>
          <span>
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
          <p className={classes.errorText}>describtion must not be empty!</p>
        )}
        </span>
        <span>
        <label className="text">
          Module Code<span className={classes.star}>*</span>
        </label>
        <input
          name="code"
          type=""
          onChange={onchange}
          onBlur={blurHandler}
          value={state.code}
        />
        {!inputsValid.code && state.codetouched && (
          <p className={classes.errorText}>Code must not be empty!</p>
        )}
        </span>
        <span>
        <label className="text">
          Language<span className={classes.star}>*</span>
        </label>
        <select
          name="language"
          type=""
          onChange={onchange}
          onBlur={blurHandler}
          value={state.language}
        >
          <option value="Arabic">Arabic</option>
          <option value="English">Enlgish </option>
        </select>
        </span>
        <span>
        <label className="text">
          ECTS<span className={classes.star}>*</span>
        </label>
        <input
          name="ECTS"
          type="number"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.ECTS}
        />
        {!inputsValid.ECTS && state.ECTStouched && (
          <p className={classes.errorText}>ECTS must be bigger than zero!</p>
        )}
        </span>
        <span>
        <label className="text">
          Midterm Exam Hours<span className={classes.star}>*</span>
        </label>
        <input
          name="midtermHours"
          type="number"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.midtermHours}
          className={classes.quart}
        />
        {!inputsValid.midtermHours && state.midtermHourstouched && (
          <p className={classes.errorText}>Midterm exam hours must be bigger than zero!</p>
        )}
        </span>
        <span>
        <label className="text">
          Endterm Exam Hours<span className={classes.star}>*</span>
        </label>
        <input
          name="lastExamHours"
          type="number"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.lastExamHours}
          className={classes.quart}
        />
        {!inputsValid.lastExamHours && state.lastExamHourstouched && (
          <p className={classes.errorText}>Endterm exam hours must be bigger than zero!</p>
        )}
        </span>
        <span>
        <label className="text">
          Module Type<span className={classes.star}>*</span>
        </label>
        <select
          name="type"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.type}
          className={classes.quart}
        >
          <option value="" hidden>Select...</option>
          <option value="elective">Elective</option>
          <option value="supportive">Supportive </option>
          <option value="core">Core </option>
        </select>
        </span>
        {state.type.length>0 &&
        <>
        <span>
        <label className="text">
          Corequisites<span className={classes.star}>*</span>
        </label>
        <Select
        options={modules}
        isMulti
        closeMenuOnSelect={false}
        onChange={(choice)=>onselect("corequisites",choice)}
        name="corequisites"
        />
        </span>
        <span>
        <label className="text">
          Prerequisite<span className={classes.star}>*</span>
        </label>
        <Select
        options={modules}
        isMulti
        closeMenuOnSelect={false}
        onChange={(choice)=>onselect("prerequisite",choice)}
        name="prerequisite"
        />
        </span></> }
        <div className={classes.button}>
          {" "}
          <button onClick={submitHandler} disabled={!formIsValid || uploading}>
           {uploading ? "Uploading" :"Add"}
          </button>
        </div>
        </div>
      </form>
    </div>
  );
};
export default AddNewModule;
