import React, { useEffect } from "react";
import classes from './AddProgramModule.module.css';
import { useState,useContext } from "react";
import ModuleInfo from "./ModuleInfo";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../../../store/fire";
import { useLocation } from "react-router-dom";
import { setreport } from "../../../../store/getandset";
import { useSelector } from "react-redux";
let initialValue={
    program:"",
    module:"",
    ECTS:0,
    level:0,
    manager:"",
    revisor:"",
    acceptanceDate:"",
    lab:"",
    theory:"",
    online:"",
    exercises:"",
    week1T:"",
    week2T:"",
    week3T:"",
    week4T:"",
    week5T:"",
    week6T:"",
    week7T:"",
    week8T:"",
    week9T:"",
    week10T:"",
    week11T:"",
    week12T:"",
    week13T:"",
    week14T:"",
    week15T:"",

}

const AddProgramModule=()=>{
const [form,setForm]=useState(initialValue);
const [modules,setModules]=useState([]);
const [completeForm,setCompleteForm]=useState({MInfo:false,MTheor:false})
const [rightContainer,setRightContainer]=useState(<ModuleInfo title="MInfo" setFormIsValid={setCompleteForm} setForm={setForm} setm={setModules} form={form}/>);
const [program,setProgram]=useState(4);
const [header,setHeader]=useState({title:"Module Information"});
const clickHandler=(probs)=>{
    switch(probs){
        case 'MInfo':
            setRightContainer(<ModuleInfo title="MInfo" setFormIsValid={setCompleteForm} setForm={setForm} form={form} setm={setModules}/>)
            setHeader({title:"Module Information"})
            break;
        case 'MTheor':
            setRightContainer(<></>)
            setHeader({title:"Theoritical Curriculum"})
            break;
    }
}
useEffect(()=>{
if(header.title==="Module Information")
setRightContainer(<ModuleInfo title="MInfo" setFormIsValid={setCompleteForm} setForm={setForm} form={form} setm={setModules}/>);
else if(header.title==="Theoritical Curriculum")
setRightContainer(<></>);
},[form])
const location=useLocation()
const profile=useSelector(state=>state.profile.profile);
const Department_id=profile.Department_id;
const submithandler =async()=>{
    const filteredObject = Object.entries(form).reduce((acc, [key, value]) => {
        if (value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {});
      console.log(filteredObject);
      let x=modules.filter((m)=>m.id===form.module);
      console.log(x);
      const id=await addDoc(collection(db,"activemodule"),{...x[0],...filteredObject});
      const reportinfo={
        page:location.pathname,
        type:"add",
        id:id.id,
        uid:auth.currentUser.uid,
        name:profile.name,
        describtion:"add a Program module",
        Department_id:Department_id,
        seen:[],
      }
    
      setreport(reportinfo,Department_id) 
}
    return(
        <main className={classes.mainContainer}>
            <div className={classes.secondaryContainer}>
                <aside className={classes.sideContainer}>
                    <div>
                    <h3>Program types</h3>
                    </div>
                    <ul>
                        <li onClick={()=>clickHandler('MInfo')} className={`${header.title=="Module Information" ? classes.activeLink :''} ${completeForm.MInfo? classes.completed:""}`}>Module Information</li>
                        <li onClick={()=>clickHandler('MTheor')} className={`${header.title=="Theoritical Curriculum" ? classes.activeLink :''} ${completeForm.MTheor? classes.completed:""}`}>Theoritical Curriculum</li>
                    </ul>
                </aside>
                <div className={classes.rightContainer}>
                    <div className={classes.header}>
                        <h3>{header.title}</h3>
                    </div>
                    <div className={classes.body}>
                     {rightContainer}
                    </div>
                </div>
                <div className={classes.button}>
                <button>Cancel</button>
                <button  onClick={submithandler}>Save</button>
                </div>
            </div>
        </main>
    );
}
export default AddProgramModule;