import React, { useState, useEffect, useReducer, cloneElement } from "react";
import { auth, creatuser, db } from "../../../../store/fire";
import Select from 'react-select'
import { Link, useLocation,useSearchParams } from "react-router-dom";
import classes from "./AddNewModule.module.css";
import { getIdToken } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { get_Sujects } from "../../../../store/getandset";
import { displayMessage } from "../../../../store/message-slice";
let modules=[
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
  language:"",
  languagetouched:false,
  lastExamHours:"",
  lastExamHourstouched:false,
  midtermHours:"",
  midtermHourstouched:false,
  type:"",
  typetouched:false,
  prerequisite:[],
  prerequisitetouched:false,
  corequisites:[],
  corequisitestouched:false
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
        prerequisite:[],
        prerequisitetouched:false,
        corequisites:[],
        corequisitestouched:false
      };
      case "untouch":
      newstate = { ...state, [action.value]: false };
    default:
  }


  return newstate;
}

const EditModule = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = (queryParams.get('id') || ''); //getting module id from url
  const [module,setModule]=useState({});
  const [subjects, setsubjects] = useState([]);
  const [defaultPrerequisite,setDefaultPrerequisite]=useState([]);
  const [defaultCorequisites,setDefaultCorequisites]=useState([]);
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

  const formTouched=(state.ECTStouched || state.nametouched || state.describtiontouched || state.codetouched || state.languagetouched || state.lastExamHourstouched || state.midtermHourstouched || state.typetouched || state.prerequisitetouched || state.corequisitestouched);
  
//   const [formTouched,setFormTouched]=useState((state.ECTStouched || state.nametouched || state.describtiontouched || state.codetouched || state.languagetouched || state.lastExamHourstouched || state.midtermHourstouched || state.typetouched || state.prerequisitetouched || state.corequisitestouched));

  const [formIsValid, setFormIsValid] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  let dispatchRedux=useDispatch();
  useEffect(()=>{ //load module using module id


    const f=async()=>{
      console.log("work");
    const data= getDoc(doc(collection(db,"subjects"),id));
    const p2= get_Sujects(Department_id);
    const [Sujects,suData] = await Promise.all([p2,data]);
    let m=suData.data();
    console.log(Sujects);
    console.log(m);
    setsubjects(Sujects);
    let modCore=[];
    if(m.corequisites.length >0)
    m.corequisites.map((m)=>modCore.push(Sujects.filter((s)=>s.value===m)[0]));
    let labelCore=[];
    modCore.map((m)=>labelCore.push(m));
    let modPre=[];
    if(m.prerequisite.length >0)
    m.prerequisite.map((m)=>modPre.push(Sujects.filter((s)=>s.value===m)[0]));
    let labelPre=[];
    modPre.map((m)=>labelPre.push(m));
    let module={
      name: m?.name?m.name:"",
      describtion: m?.describtion?m.describtion:"",
      ECTS: m?.ECTS?m.ECTS:0,
      code:m?.code?m.code:"",
      language:m?.language?m.language:"",
      lastExamHours:m?.endTermHours?m.endTermHours:0,
      midtermHours:m?.midTermHours?m.midTermHours:0,
      type:m?.type?m.type:"",
      prerequisite:labelPre,
corequisites:labelCore,
id:id
  };
  console.log(module);
      setModule(module);
      console.log(data);
    }
    if(Department_id)
    f();
   
  },[Department_id,profile]);
  useEffect(() => {
    if (inputsValid.describtion && inputsValid.ECTS && inputsValid.name && inputsValid.code && inputsValid.lastExamHours && inputsValid.midtermHours && inputsValid.type) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [inputsValid]);
  useEffect(()=>{
    function mapData(object,input){
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
    objectMap(module,mapData);



  },[module]);
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

    const action2 = {
        type: "touch",
        value: e.target.name + "touched",
      };
      dispatch(action2);

  }
  function onselect(input,obj){

    const action = {
      type: "input",
      input: input,
      value: obj,
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
    // course is variable indicating course number with values 1 or 2
    setUploading(true);
    try{
      let p=[];
      state.prerequisite.map((pr)=>p.push(pr.value));
      let c=[];
      state.corequisites.map((cr)=>c.push(cr.value));
    const info = {
      name: state.name,
      describtion: state.describtion,
      ECTS: state.ECTS,
      code: state.code,
      language:state.language,
      midTermHours:state.midtermHours,
      endTermHours:state.lastExamHours,
      type:state.type,
      prerequisite:p,
      corequisites:c,
      Deprartment_id: auth.currentUser.uid,
      University_id:profile.University_id,
      College_id:profile.College_id,
    };
    console.log(info);
    await setDoc(doc(db,"subjects",module.id),{
      ...info,
    });
    dispatchRedux(displayMessage("Module was saved succesfully!"))
  }
  catch(e){
    dispatchRedux(displayMessage("An error occurred!"))
    console.log(e);
  }
 finally{
  setUploading(false);
 }
  const action={
    type:"reset"
  };
  dispatch(action);
  };

  console.log(!formIsValid  && !(state.ECTStouched || state.nametouched || state.describtiontouched || state.codetouched || state.languagetouched || state.lastExamHourstouched || state.midtermHourstouched || state.typetouched || state.prerequisitetouched || state.corequisitestouched));

  return (
    <div className={`${classes.container}`}>
      <form action="" className=" form">
        <h3>Edit Module</h3>
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
        options={subjects}
        isMulti
        closeMenuOnSelect={false}
        onChange={(choice)=>onselect("corequisites",choice)}
        name="corequisites"
        defaultValue={state.corequisites}
        />
        </span>
        <span>
        <label className="text">
          Prerequisite<span className={classes.star}>*</span>
        </label>
        <Select
        options={subjects}
        isMulti
        closeMenuOnSelect={false}
        onChange={(choice)=>onselect("prerequisite",choice)}
        name="prerequisite"
        defaultValue={ state.prerequisite}
        />
        </span></> }
        <div className={classes.button}>
          {" "}

          <button onClick={submitHandler} disabled={!formIsValid  || !(state.ECTStouched || state.nametouched || state.describtiontouched || state.codetouched || state.languagetouched || state.lastExamHourstouched || state.midtermHourstouched || state.typetouched || state.prerequisitetouched || state.corequisitestouched) || uploading}>
           {uploading ? "Uploading..." :"Save"}

          </button>
        </div>
        </div>
      </form>
    </div>
  );
};
export default EditModule;
