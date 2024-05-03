import { Alert, Checkbox, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import classes  from "./ModuleStructuredHours.module.css"
import Select from 'react-select'
const findTitle=(key)=>{
  if (key==="AssesmentLab")
  return "Lab";
  else if( key === "AssesmentProject")
  return "Projects"
  else if( key === "AssesmentQuizes")
  return "Quizes"
  else if( key === "AssesmentOnline")
  return "Online Assignments"
  else if( key === "AssesmentOnsight")
  return "Onsight Assignments"
  else if( key === "AssesmentReports")
  return "Reports"
}
const ModuleAssesment=(probs)=>{
    let { form, setForm, setFormIsValid, setDisable,modules } = probs;
    const myObject = {
        AssesmentLab:form.AssesmentLab,
        AssesmentProject:form.AssesmentProject,
        AssesmentQuizes:form.AssesmentQuizes,
        AssesmentOnline:form.AssesmentOnline,
        AssesmentOnsight:form.AssesmentOnsight,
        AssesmentReports:form.AssesmentReports,
    };
    const fields = Object.entries(myObject).map(([key, value]) => ({ key, value }));
    let initialActivatedAssesments=0;
    Object.keys(myObject).forEach(outerKey => {
      if(myObject[outerKey]["activated"]){
        ++initialActivatedAssesments;
      }
    });
    const [totalAssesmentDegree,setTotalAssesmentDegree] = useState(0); //find the total degree
    useEffect(()=>{
      setTotalAssesmentDegree(0);
    Object.keys(myObject).forEach(outerKey => {
      const innerObject = myObject[outerKey];
      const degree = innerObject.degreePerTime;
      const noTimes=innerObject.noTimes;
      console.log(totalAssesmentDegree,"tad");

      // Check if totalHours is a non-empty string representing a number
      if (degree !== null && degree !== "" && !isNaN(parseFloat(degree))) {
        setTotalAssesmentDegree((prev)=> prev+(+parseFloat(degree) * +noTimes));
        console.log(totalAssesmentDegree,"tad");
      }});
    },[form]);

    const [assesmentsActivaed,setAssesmentsActivated]=useState(initialActivatedAssesments); //find no of assesments activated
    console.log(assesmentsActivaed);
    const initialTouchedFields = {}; //set the touch logic for inputs
    Object.keys(myObject).forEach(outerKey => {
      initialTouchedFields[outerKey] = {};
      Object.keys(myObject[outerKey]).forEach(innerKey => {
        initialTouchedFields[outerKey][innerKey] = false;
      });
    });
    const [fieldTouched,setFieldTouched]=useState(initialTouchedFields)
    const inputsValid = {};
      for (const key in myObject) {
        const value = myObject[key];
        inputsValid[key] = {
          activated:value["activated"],
          noTimes: value["noTimes"] !== "" ? value["noTimes"] >= 0 : false,
          degreePerTime: value["degreePerTime"] !== ""? value["degreePerTime"] >= 0 : false,
          noWeeks: value["noWeeks"].length > 0,
        };
    }
    useEffect(() => {
        console.log(inputsValid);
        if ( Object.values(inputsValid).every((validation) => 
        Object.values(validation).every((isValid) => { if(!validation["activated"]){return true;} return isValid === true}))) { //checking all validations
          setFormIsValid((prev)=> {return{...prev ,"MAST":assesmentsActivaed > 3}});
          console.log(assesmentsActivaed);
          console.log(true);
        } else {
          setFormIsValid((prev)=> {return{...prev ,"MAST":false}});
          console.log("false");
      }
      }, [inputsValid]);
      const onchange=(e,fieldName)=>{
        if(e.target.name === "activated"){
          setForm((prev) => {
            if(prev[fieldName][e.target.name]){
              setAssesmentsActivated(prev=>--prev);
              setFieldTouched((prev) => {
                console.log(prev);
                return { ...prev, [fieldName]:{noTimes:false,degreePerTime:false,noWeeks:false} };
              });
              return { ...prev, [fieldName]:{noTimes:"",degreePerTime:"",noWeeks:[],[e.target.name]:!prev[fieldName]["activated"]} };
            }
            else{
              setAssesmentsActivated(prev=>++prev);
              return { ...prev, [fieldName]:{...prev[fieldName],[e.target.name]:!prev[fieldName]["activated"]} };
            } 
          });
          return;
        }
        setForm((prev) => {
            console.log(prev);
            return { ...prev, [fieldName]:{...prev[fieldName],[e.target.name]:e.target.value} };
          });
      }
      const onSelect=(choice,inputName,fieldName)=>{
        console.log(choice);
        if(choice.length > 0){
          let choices=[];
          choice.map((ch)=>choices.push((ch.value)));
        setForm((prev) => {
          console.log(prev);
          return { ...prev, [fieldName]:{...prev[fieldName],[inputName]:choices} };
        });
      }
      else{
        setForm((prev) => {
          console.log(prev);
          return { ...prev, [fieldName]:{...prev[fieldName],[inputName]:[]} };
        });
      }
      }
      const blurHandler=(e,fieldName)=>{
        setFieldTouched((prev) => {
          console.log(prev);
          return { ...prev, [fieldName]:{...prev[fieldName],[e.target.name]:true} };
        });
      };
      console.log(form["AssesmentLab"]["activated"]);
      return(
        <div className={classes.mainContainer}>
        { <Alert severity={assesmentsActivaed >= 4 ? "success":"error"}>Number of assesments activated {assesmentsActivaed} </Alert>}
       { <Alert severity="info" sx={{marginTop:"0.4rem"}}>The sum of specified degrees: {totalAssesmentDegree} </Alert>} 
        <ul className={classes.listContainer}>
       {fields.map(({ key, value })=>{
       let isDisabled=form[key]["noWeeks"].includes("Continuously Throughout the semester");
       let choices=[            //set the initial value of choices of noWeeks field
       {label:"Continuously Throughout the semester",value:"Continuously Throughout the semester",id:"0",isDisabled:!isDisabled && form[key]["noWeeks"].length > 0},
     ];
       for (let i = 0; i < 15; i++) {
         let dataObject = {
             label: `${i + 1}`,
             value: `${i + 1}`,
             id: i,
             isDisabled:isDisabled || (form[key]["noWeeks"].length >= +form[key]["noTimes"])
         };
         choices.push(dataObject);
     }
            return(
     <li key={key + value}>
      <div className={`${classes.container}`} key={key + value}>
      <form action="" className=" form">
      <FormControlLabel value={form[key]["activated"]} className={ classes.cardTitle}control={<Checkbox name="activated"  checked={form[key]["activated"]}   onChange={(e)=>onchange(e,key)}/>} label={findTitle(key)} />
        <div className={classes.fields}>
      <span>
        <label className="text">
          Number of Times
        </label>
        <input
          name="noTimes"
          type="number"
          onChange={(e)=>onchange(e,key)}
          value={form[key]["noTimes"]}
          className={!inputsValid[key]["noTimes"] && fieldTouched[key]["noTimes"] ?  classes.error:""}
          min={0}
          disabled={!form[key]["activated"]}
          onBlur={(e)=>blurHandler(e,key)}
        />
        {!inputsValid[key]["noTimes"] && fieldTouched[key]["noTimes"] && (
              <p className={classes.errorText}> value must not be null or negative!</p>
            )}
      </span>
      <span>
        <label className="text">
          Degree Per Time
        </label>
        <input
          name="degreePerTime"
          type="number"
          onChange={(e)=>onchange(e,key)}
          className={!inputsValid[key]["degreePerTime"] && fieldTouched[key]["degreePerTime"]?  classes.error:""}
          value={form[key]["degreePerTime"]}
          min={0}
          disabled={!form[key]["activated"]}
          onBlur={(e)=>blurHandler(e,key)}
        />
         {!inputsValid[key]["degreePerTime"] && fieldTouched[key]["degreePerTime"] && (
              <p className={classes.errorText}> value must not be null or  negative!</p>
            )}
      </span>
      <span>
        <label className="text">
          Choose Weeks Number<span className={classes.star}>*</span>
        </label>
        <Select
        options={choices}
        isMulti
        closeMenuOnSelect={false}
        onChange={(choice)=>onSelect(choice,"noWeeks",key)}
        value={form[key]["noWeeks"] !== "" ? choices.filter((ch)=>form[key]["noWeeks"].includes(ch.value)) : ""}
        name="noWeeks"
        isDisabled={!form[key]["activated"] || form[key]["noTimes"] === ""}
        />
        </span>
        </div>
        </form>
        </div>
        </li>
            )
        }
    
        )
    }
    </ul>
    </div>
    )
}
export default ModuleAssesment;