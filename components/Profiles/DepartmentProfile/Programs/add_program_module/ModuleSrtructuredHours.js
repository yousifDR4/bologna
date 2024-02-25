import { useEffect, useState } from "react";
import classes from "./ModuleStructuredHours.module.css";
import Alert from '@mui/material/Alert';
const findTitle=(key)=>{
    if (key==="structHoursCR")
    return "Inside Classroom";
    else if( key === "structHoursON")
    return "Online Hours"
    else if( key === "structHoursSC")
    return "Studying Cycles"
    else if( key === "structHoursLB")
    return "Lab Hours"
    else if( key === "structHoursPR")
    return "Practical Hours"
    else if( key === "structHoursCL")
    return "Clinical Hours"
}
const ModuleStructuredHours=(probs)=>{
    let { form, setForm, setFormIsValid, setDisable,modules } = probs;
    let selectedModule;
    if(modules.length){ //find the selected module from all modules
      console.log(form.module);
  selectedModule=modules.filter((mod)=>mod.id === form.module)[0];
    console.log(selectedModule);
    };
    
    const myObject = {
      structHoursCR: form["structHoursCR"],
      structHoursON: form["structHoursON"],
      structHoursSC: form["structHoursSC"],
      structHoursLB: form["structHoursLB"],
      structHoursPR: form["structHoursPR"],
      structHoursCL: form["structHoursCL"],
    };
    const initialTouchedFields = {}; //set the touch logic for inputs
    Object.keys(myObject).forEach(outerKey => {
      initialTouchedFields[outerKey] = {};
      Object.keys(myObject[outerKey]).forEach(innerKey => {
        initialTouchedFields[outerKey][innerKey] = false;
      });
    });
    const [totalHoursSum,setTotalHoursSum] = useState(0); //find the total hours sum of all structured hours
useEffect(()=>{
  setTotalHoursSum(0);
Object.keys(myObject).forEach(outerKey => {
  const innerObject = myObject[outerKey];
  const totalHours = innerObject.totalHours;
  // Check if totalHours is a non-empty string representing a number
  if (totalHours !== null && totalHours !== "" && !isNaN(parseFloat(totalHours))) {
  setTotalHoursSum((prev)=> prev+parseFloat(totalHours));
  
  }});
  console.log(totalHoursSum);
  const unStructHours=form["unStructHours"];
  Object.keys(unStructHours).forEach(outerKey => {
    console.log(unStructHours,outerKey);
    const innerObject = unStructHours[outerKey];
    const totalHours = innerObject.totalHours;
    // Check if totalHours is a non-empty string representing a number
    if (totalHours !== null && totalHours !== "" && !isNaN(parseFloat(totalHours))) {
    setTotalHoursSum((prev)=> prev+parseFloat(totalHours));
    }
});
},[form]);
console.log(totalHoursSum);
      const [fieldTouched,setFieldTouched]=useState(initialTouchedFields)
      const fields = Object.entries(myObject).map(([key, value]) => ({ key, value }));
      const inputsValid = {};
      for (const key in myObject) {
        const value = myObject[key];
        inputsValid[key] = {
          noWeeks: value["noWeeks"] !== "" ? value["noWeeks"] >= 0 : false,
          noHours: value["noHours"] !== ""? value["noHours"] >= 0 : false,
          totalHours: value["totalHours"] !== "" ? value["totalHours"] >= 0 : false,
        };
      }      console.log(inputsValid);
      console.log(fields);

      useEffect(() => {
        console.log(inputsValid);
        if ( Object.values(inputsValid).every((validation) =>
        Object.values(validation).every((isValid) => isValid === true))) { //checking all validations
          setFormIsValid((prev)=> {return{...prev ,"MSTH":true}});
        } else {
          setFormIsValid((prev)=> {return{...prev ,"MSTH":false}});
          console.log("false");
        }
      }, [inputsValid]);
      const onchange=(e,fieldName)=>{
        setForm((prev) => {
            console.log(prev);
            return { ...prev, [fieldName]:{...prev[fieldName],[e.target.name]:e.target.value} };
          });
          setForm((prev) => {
            console.log(prev[fieldName]);
            return { ...prev, [fieldName]:{...prev[fieldName],totalHours:+prev[fieldName]["noHours"]* +prev[fieldName]["noWeeks"]} };
          });
      }
      const blurHandler=(e,fieldName)=>{
        setFieldTouched((prev) => {
          console.log(prev);
          return { ...prev, [fieldName]:{...prev[fieldName],[e.target.name]:true} };
        });
      };
    return(
      <div className={classes.mainContainer}>
        {<Alert severity={form.module.length ? +selectedModule.ECTS * 25 < +totalHoursSum ? "error":"success":"info"}>The total structured and unstructured hours for the semester is {totalHoursSum} </Alert>}
        <ul className={classes.listContainer}>
       {fields.map(({ key, value })=>{
            return(
     <li key={key + value}>
        <h3>{findTitle(key)}</h3>
             <div className={`${classes.container}`} key={key + value}>
      <form action="" className=" form">
        <div className={classes.fields}>
      <span>
        <label className="text">
          Number of Weeks
        </label>
        <input
          name="noWeeks"
          type="number"
          onChange={(e)=>onchange(e,key)}
          value={form[key]["noWeeks"]}
          className={!inputsValid[key]["noWeeks"] && fieldTouched[key]["noWeeks"] ?  classes.error:""}
          min={0}
          onBlur={(e)=>blurHandler(e,key)}
        />
        {!inputsValid[key]["noWeeks"] && fieldTouched[key]["noWeeks"] && (
              <p className={classes.errorText}> value must not be null or negative!</p>
            )}
      </span>
      <span>
        <label className="text">
          Number of Hours per Week
        </label>
        <input
          name="noHours"
          type="number"
          onChange={(e)=>onchange(e,key)}
          className={!inputsValid[key]["noHours"] && fieldTouched[key]["noHours"]?  classes.error:""}
          value={form[key]["noHours"]}
          min={0}
          onBlur={(e)=>blurHandler(e,key)}
        />
         {!inputsValid[key]["noHours"] && fieldTouched[key]["noHours"] && (
              <p className={classes.errorText}> value must not be null or  negative!</p>
            )}
      </span>
      <span >
        <label className="text">
          Total Hours
        </label>
        <input
          name="totalHours"
          type="number"
          onChange={(e)=>onchange(e,key)}
          className={!inputsValid[key]["totalHours"]&& fieldTouched[key]["totalHours"]?  classes.error:""}
          value={form[key]["totalHours"]}
          min={0}
          disabled
        />
         {!inputsValid[key]["totalHours"] && fieldTouched[key]["totalHours"] && (
              <p className={classes.errorText}> value must not be null or negative!</p>
            )}
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
export default ModuleStructuredHours;

