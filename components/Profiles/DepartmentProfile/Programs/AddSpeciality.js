import React, { useState, useEffect, useReducer, cloneElement } from "react";
import { auth, creatuser, db } from "../../../../store/fire";
import Select from 'react-select'
import classes from "./AddSpeciality.module.css";
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
  required:[],
  requiredtouched:false,

};
function reducer(state, action) {
  let newstate = {};
  console.log(action);
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
        required:[],
        requiredtouched:false
      };
    default:
  }
  return newstate;
}

const AddSpeciality = (probs) => {
  const {program,showAdd}=probs;
  const [modules,setModules]=useState([])
  const [state, dispatch] = useReducer(reducer, intilistate);
  const [uploading,setUploading]=useState(false);
  const inputsValid = {
    name: state.name.trim() !== "",
    required:state.required.length > 0
  };
  const [formIsValid, setFormIsValid] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  useEffect(() => {
    if (inputsValid.name && inputsValid.required) {
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
    let value= state.required;
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
    dispatch(action);
    const action2 = {
        type: "touch",
        value: input + "touched",
      };
      dispatch(action2);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setUploading(true);
    //program is program     
    try{
    // const info = {
    //   name: state.name,
    //   prerequisite:state.prerequisite,
    // };
    // console.log();
    // const id = await addDoc(collection(db, "subjects"), info);
    // console.log(id.id);
    // await updateDoc(doc(db, "users", auth.currentUser.uid), {
    //   subjects_id: arrayUnion(id.id),
    // });
    setUploading(false); // dont delete my code
    showAdd(false);
  }
  catch(e){
    setUploading(false); //dont please
    console.log(e);
    showAdd(false);
  }
 
  const action={
    type:"reset"
  };
  dispatch(action);
  };
useEffect(()=>{
  if (!auth.currentUser)
  return; 
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
        <h3>Add a new speciality</h3>
        <div className={classes.fields}>
          <span>
        <label htmlFor="email">
          Speciality Name<span className={classes.star}>*</span>
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
          Requird Modules<span className={classes.star}>*</span>
        </label>
        <Select
        options={modules}
        isMulti
        closeMenuOnSelect={false}
        onChange={(choice)=>onselect("prerequisite",choice)}
        name="required"
        />
         {!inputsValid.required && state.requiredtouched && (
          <p className={classes.errorText}> at least one module!</p>
        )}
        </span> 
        <div className={classes.button}>
          {" "}
          <button onClick={()=>showAdd(false)}>
           cancel
          </button>
          <button onClick={submitHandler} disabled={!formIsValid || uploading}>
           {uploading ? "Uploading" :"Add"}
          </button>
        </div>
        </div>
      </form>
    </div>
  );
};
export default AddSpeciality;
