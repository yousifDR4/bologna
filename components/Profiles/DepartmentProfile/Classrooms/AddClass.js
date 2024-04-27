import React, { useState, useEffect, useReducer, cloneElement } from "react";
import { auth, creatuser, db } from "../../../../store/fire";
import classes from "./AddClass.module.css";
import { getIdToken } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { displayMessage } from "../../../../store/message-slice";

const intilistate = {
  name: "",
  nametouched: false,
  notes: "",
  place: "",
  placetouched: false,
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
        notes: "",
        place: "",
        placetouched: false,
      };
    default:
  }
  return newstate;
}

const AddClass = (probs) => {

  const { classroom,edit,open } = probs;
  console.log(classroom,edit);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id= profile.Department_id;
  const [state, dispatch] = useReducer(reducer, intilistate);
  const [uploading,setUploading]=useState(false);
  const dispatchRedux=useDispatch();
  const inputsValid = {
    name: state.name.trim() !== "",
    place: state.place.trim() !== "",
  };
useEffect(() => {
  if(!edit){
    const action={
      type:"reset"
    };
    dispatch(action);
  }
}, [edit]);


  const [formIsValid, setFormIsValid] = useState(false);
  useEffect(() => {
    if (inputsValid.place && inputsValid.name) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [inputsValid]);
    useEffect(()=>{
        if(classroom){
            if(classroom.name){
                function mapData(object,input){
                    const action={
                           type:"input",
                           input:input,
                           value :object
                         }
                        dispatch(action);
                  }
                 
                  const objectMap = (obj, fn) =>
                  Object.fromEntries(
                    Object.entries(obj).map(
                      ([k, v], i) => [k, fn(v, k, i)]
                    )
                  );
                  objectMap(classroom,mapData);
            }
        }
    },[classroom])
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
    setUploading(true);
    // if it's edit then edit ==true else false
  
 

    try{
      const info = {
        name: state.name,
        namelower:state.name.toLocaleLowerCase(),
        notes:state.notes,
        place:state.place,
        Deprartment_id:Department_id
      };
      const userRef=doc(db,"users",Department_id)
      const ref=await addDoc(collection(userRef,"classRooms"),info)
        dispatchRedux(displayMessage("Class Added Successfully","success"))
        setUploading(false);
    }
  catch(e){
    setUploading(false);
    dispatchRedux(displayMessage("Failed To Add Class","error"))
    console.log(e);
  }
  probs.showAdd(false);
  probs.setReload((prev)=>!prev);
  const action={
    type:"reset"
  };
  dispatch(action);
  };
  return (
    <div className={`${classes.container} ${probs.className}`}>
      <form action="" className=" form">
        <h3>Add a new classroom</h3>
        <div className={classes.fields}>
          <span>
        <label htmlFor="name">
         Classroom Name<span className={classes.star}>*</span> 
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
        )}</span>
        <span>
        <label className="text">
          Place<span className={classes.star}>*</span>
        </label>
        <input
          name="place"
          type="text"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.place}
        />
        {!inputsValid.place && state.place && (
          <p className={classes.errorText}>Place must not be empty!</p>
        )}</span>
        <span>
        <label className="text">
          Notes
        </label>
        <textarea
          name="notes"
          type=""
          onChange={onchange}
          onBlur={blurHandler}
          value={state.notes}
        /></span>
        <div className={classes.button}>
          {" "}
          <button onClick={submitHandler} disabled={!formIsValid || uploading}>
          {uploading? "Uploading..." :"Add"}
          </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddClass;
