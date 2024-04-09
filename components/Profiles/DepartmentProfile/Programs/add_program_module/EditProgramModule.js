import React, { useEffect } from "react";
import classes from "./AddProgramModule.module.css";
import { useState,useContext } from "react";
import { addDoc, collection } from "firebase/firestore";
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { auth, db } from "../../../../../store/fire";
import { useLocation } from "react-router-dom";
import { setreport } from "../../../../../store/getandset";
import { useDispatch, useSelector } from "react-redux";
import ModuleTheory from "./ModuleTheory";
import ModuleLab from "./ModuleLab";
import ModuleStructuredHours from "./ModuleSrtructuredHours";
import ProgressBar from "@ramonak/react-progress-bar";
import LinearWithValueLabel from "../../../../UI/progressBar/LinearProgressWithLabel";
import ModuleUnStructuredHours from "./ModuleUnstructHours";
import ModuleAssesment from "./ModuleAssesment";
import ModuleSources from "./ModuleSources";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import { Button } from "@mui/material";
import ModuleInfo from "./ModuleInfo";
import { Add, Save, Upload } from "@mui/icons-material";
import { messageActions } from "../../../../../store/message-slice";


const EditProgramModule=(probs)=>{
    const {moduleProb=[],progress=0,completion}=probs;
    let initialValue={
        program: moduleProb.program || "",
    module: moduleProb.module || "",
    ECTS: moduleProb.ECTS || "",
    level: moduleProb.level || "",
    manager: moduleProb.manager || "",
    revisor: moduleProb.revisor || "",
    acceptanceDate: moduleProb.acceptanceDate || "",
    lab: moduleProb.lab || "",
    theory: moduleProb.theory || "",
    online: moduleProb.online || "",
    exercises: moduleProb.exercises || "",
    week1T: moduleProb.week1T || "",
    week2T: moduleProb.week2T || "",
    week3T: moduleProb.week3T || "",
    week4T: moduleProb.week4T || "",
    week5T: moduleProb.week5T || "",
    week6T: moduleProb.week6T || "",
    week7T: moduleProb.week7T || "",
    week8T: moduleProb.week8T || "",
    week9T: moduleProb.week9T || "",
    week10T: moduleProb.week10T || "",
    week11T: moduleProb.week11T || "",
    week12T: moduleProb.week12T || "",
    week13T: moduleProb.week13T || "",
    week14T: moduleProb.week14T || "",
    week15T: moduleProb.week15T || "",
    week1L: moduleProb.week1L || "",
    week2L: moduleProb.week2L || "",
    week3L: moduleProb.week3L || "",
    week4L: moduleProb.week4L || "",
    week5L: moduleProb.week5L || "",
    week6L: moduleProb.week6L || "",
    week7L: moduleProb.week7L || "",
    week8L: moduleProb.week8L || "",
    week9L: moduleProb.week9L || "",
    week10L: moduleProb.week10L || "",
    week11L: moduleProb.week11L || "",
    week12L: moduleProb.week12L || "",
    week13L: moduleProb.week13L || "",
    week14L: moduleProb.week14L || "",
    week15L: moduleProb.week15L || "",
        structHoursCR:moduleProb.structHoursCR || {noWeeks:"",noHours:"",totalHours:""},
        structHoursON:moduleProb.structHoursON || {noWeeks:"",noHours:"",totalHours:""},
        structHoursSC:moduleProb.structHoursSC || {noWeeks:"",noHours:"",totalHours:""},
        structHoursLB:moduleProb.structHoursLB || {noWeeks:"",noHours:"",totalHours:""},
        structHoursPR:moduleProb.structHoursPR || {noWeeks:"",noHours:"",totalHours:""},
        structHoursCL:moduleProb.structHoursCL ||{noWeeks:"",noHours:"",totalHours:""},
        unStructHours:moduleProb.unStructHours || {},
        AssesmentLab:moduleProb.AssesmentLab || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        AssesmentProject:moduleProb.AssesmentProject || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        AssesmentQuizes:moduleProb.AssesmentQuizes || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        AssesmentOnline:moduleProb.AssesmentOnline || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        AssesmentOnsight: moduleProb.AssesmentOnsight || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        AssesmentReports:moduleProb.AssesmentReports || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        books:moduleProb.books || [],
        onlineSources:moduleProb.onlineSources || ""
    }
    const dispatch=useDispatch();
const [form,setForm]=useState(initialValue);
const [progressCounter,setProgressCounter]=useState(progress);
const [disable,setDisable]=useState(false);
const [modules,setModules]=useState([]); 
const [completeForm,setCompleteForm]=useState(completion); //used in progress bar and classes style
const [rightContainer,setRightContainer]=useState(<ModuleInfo title="MInfo" setFormIsValid={setCompleteForm} setForm={setForm} setm={setModules} form={form}/>);
const [program,setProgram]=useState(4);
const [header,setHeader]=useState({title:"Module Information"});
const [uploading,setUploading]=useState(false);
console.log(completeForm);
useEffect(() => {
    updateProgress();
  }, [completeForm]);
  const updateProgress = () => { //update Progress bar
    const trueCount = Object.values(completeForm).filter(value => value).length;
    const newProgress = (trueCount /7) * 100;
    setProgressCounter(newProgress);
  };
const clickHandler=(probs)=>{
    switch(probs){
        case 'MInfo':
            setRightContainer(<ModuleInfo title="MInfo" setFormIsValid={setCompleteForm} setForm={setForm} form={form} setm={setModules}/>)
            setHeader({title:"Module Information"})
            break;
        case 'MTheor':
            setRightContainer(<ModuleTheory title="MTheor" setFormIsValid={setCompleteForm} setForm={setForm} form={form} setm={setModules}/>)
            setHeader({title:"Theoritical Curriculum"});
            break;
        case 'MLab':
              setRightContainer(<ModuleLab title="MLab" setFormIsValid={setCompleteForm} setForm={setForm} form={form} setm={setModules}/>)
               setHeader({title:"Lab Curriculum"});
            break;
            case 'MSTH':
              setRightContainer(<ModuleStructuredHours title="MSTH" setFormIsValid={setCompleteForm} setDisable={setDisable} setForm={setForm} form={form} modules={modules} setm={setModules}/>)
               setHeader({title:"Structured Hours"});
            break;
            case 'MUSTH':
                setRightContainer(<ModuleUnStructuredHours title="MUSTH" setFormIsValid={setCompleteForm} setDisable={setDisable} setForm={setForm} form={form} modules={modules} setm={setModules}/>)
                 setHeader({title:"UnStructured Hours"});
              break;
              case 'MAST':
                setRightContainer(<ModuleAssesment title="MAST" setFormIsValid={setCompleteForm} setDisable={setDisable} setForm={setForm} form={form} modules={modules} setm={setModules}/>)
                 setHeader({title:"Grade Assesment"});
              break;
              case 'MLS':
                setRightContainer(<ModuleSources title="MLS" setFormIsValid={setCompleteForm} setDisable={setDisable} setForm={setForm} form={form} modules={modules} setm={setModules}/>)
                 setHeader({title:"Learning Sources"});
              break;
    }
}
useEffect(()=>{
if(header.title==="Module Information")
setRightContainer(<ModuleInfo title="MInfo" setFormIsValid={setCompleteForm} setForm={setForm} form={form} setm={setModules}/>);
else if(header.title==="Theoritical Curriculum")
setRightContainer(<ModuleTheory title="MTheor" setFormIsValid={setCompleteForm} setForm={setForm} form={form} setm={setModules}/>);
else if(header.title==="Lab Curriculum")
setRightContainer(<ModuleLab title="MLab" setFormIsValid={setCompleteForm} setForm={setForm} form={form} setm={setModules}/>)
else if(header.title==="Structured Hours")
setRightContainer(<ModuleStructuredHours title="MSTH" setFormIsValid={setCompleteForm} setForm={setForm} form={form} setDisable={setDisable}  modules={modules} setm={setModules} />)
else if(header.title === "UnStructured Hours")
setRightContainer(<ModuleUnStructuredHours title="MUSTH" setFormIsValid={setCompleteForm} setDisable={setDisable} setForm={setForm} form={form} modules={modules} setm={setModules}/>);
else if(header.title === "Grade Assesment")
setRightContainer(<ModuleAssesment title="MAST" setFormIsValid={setCompleteForm} setDisable={setDisable} setForm={setForm} form={form} modules={modules} setm={setModules}/>)
else if(header.title === "Learning Sources")
setRightContainer(<ModuleSources title="MLS" setFormIsValid={setCompleteForm} setDisable={setDisable} setForm={setForm} form={form} modules={modules} setm={setModules}/>)
},[form])
const location=useLocation()
const profile=useSelector(state=>state.profile.profile);
const Department_id=profile.Department_id;
const submithandler =async()=>{
    setUploading(true);
    try{
    const filteredObject = Object.entries(form).reduce((acc, [key, value]) => {
        if (value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {});
      console.log(filteredObject);
      let x=modules.filter((m)=>m.id===form.module);
      const id=await addDoc(collection(db,"activemodule"),{...x[0],...filteredObject,
        progress:progressCounter,
        completedSections:completeForm,
        type: +filteredObject.program,
        level: +filteredObject.level,
        ECTS:+filteredObject.ECTS});
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
      //form contains all the values to be uploaded
      setUploading(false);
      dispatch(messageActions.setMessage({messageContent:"The Module was added succesfully!",severity:"success"}))
      setForm(initialValue);
    }
      catch(e){
        console.log(e);
        setUploading(false);
      }
}
    return(
        <main className={classes.mainContainer}>
            <div className={classes.secondaryContainer}>
                <aside className={classes.sideContainer}>
                    <div className={classes.progressBar}>
                    <p>Progress</p>
                    <LinearWithValueLabel value={progressCounter}/>
                    </div>
                    <ul>
                        <li onClick={()=>clickHandler('MInfo')} className={`${header.title=="Module Information" ? classes.activeLink :''} ${completeForm.MInfo? classes.completed:""}`} key="0"><CheckIcon check={completeForm.MInfo}/> Module Information </li>
                        <li onClick={()=>clickHandler('MTheor')} className={`${header.title=="Theoritical Curriculum" ? classes.activeLink :''} ${completeForm.MTheor? classes.completed:""}`} key="1"><CheckIcon check={completeForm.MTheor}/> Theoritical Curriculum </li>
                        <li onClick={()=>clickHandler('MLab')} className={`${header.title=="Lab Curriculum" ? classes.activeLink :''} ${completeForm.MLab? classes.completed:""}`} key="2"><CheckIcon check={completeForm.MLab}/> Lab Curriculum </li>
                        <li onClick={()=>clickHandler('MSTH')} className={`${header.title=="Structured Hours" ? classes.activeLink :''} ${completeForm.MSTH? classes.completed:""}`} key="3"><CheckIcon check={completeForm.MSTH}/> Structured Hours </li>
                        <li onClick={()=>clickHandler('MUSTH')} className={`${header.title=="UnStructured Hours" ? classes.activeLink :''} ${completeForm.MUSTH? classes.completed:""}`} key="4"><CheckIcon check={completeForm.MUSTH}/> UnStructured Hours </li>
                        <li onClick={()=>clickHandler('MAST')} className={`${header.title=="Grade Assesment" ? classes.activeLink :''} ${completeForm.MAST? classes.completed:""}`} key="5"><CheckIcon check={completeForm.MAST}/> Grade Assesment </li>
                        <li onClick={()=>clickHandler('MLS')} className={`${header.title=="Learning Sources" ? classes.activeLink :''} ${completeForm.MLS? classes.completed:""}`} key="6"><CheckIcon check={completeForm.MLS}/> Learning Sources </li>
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
                <Button onClick={submithandler} startIcon={uploading ? <Upload/> :<Save/>}  variant="outlined" disabled={!completeForm.MInfo || uploading}>{uploading ?"Uploading":"Save"}</Button>
                </div>
            </div>
        </main>
        
    );
}
const CheckIcon=(probs)=>{
if(probs.check){
    return(
        <CheckCircleRoundedIcon sx={{color:"#569388",verticalAlign:"middle",marginLeft:"0.2rem"}}/>
    )
}
return <ErrorRoundedIcon sx={{color:"#B8BFC6",verticalAlign:"middle",marginLeft:"0.2rem"}}/>
}
export default EditProgramModule;