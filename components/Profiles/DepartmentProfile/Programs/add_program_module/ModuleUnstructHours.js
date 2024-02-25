import { useEffect, useState } from "react";
import classes from "./ModuleStructuredHours.module.css";
import Alert from '@mui/material/Alert';
import AddUnstructHours from "./AddUnstructHours";
const ModuleUnStructuredHours=(probs)=>{
    let { form, setForm, setFormIsValid, setDisable,modules } = probs;
    let selectedModule;
    if(modules.length){ //find the selected module from all modules
  selectedModule=modules.filter((mod)=>mod.id === form.module)[0];
    };
    const [trigger,setTrigger]=useState(false);
    const myObject = {...form.unStructHours};
    console.log(myObject);
    const initialTouchedFields = {}; //set the touch logic for inputs
    Object.keys(myObject).forEach(outerKey => {
      initialTouchedFields[outerKey] = {};
      Object.keys(myObject[outerKey]).forEach(innerKey => {
        initialTouchedFields[outerKey][innerKey] = false;
      });
    });
    const [fieldTouched,setFieldTouched]=useState(initialTouchedFields)
    const [totalHoursSum,setTotalHoursSum] = useState(0); //find the total hours sum of all structured hours

useEffect(()=>{
  setTotalHoursSum(0);
  console.log("Wewqwfjqbjnkdjnnwjkbfqjnkfb");
Object.keys(myObject).forEach(outerKey => {
  const innerObject = myObject[outerKey];
  const totalHours = innerObject.totalHours;
  // Check if totalHours is a non-empty string representing a number
  if (totalHours !== null && totalHours !== "" && !isNaN(parseFloat(totalHours))) {
  setTotalHoursSum((prev)=> prev+parseFloat(totalHours));
  }
  const structHours = {
    structHoursCR: form["structHoursCR"],
    structHoursON: form["structHoursON"],
    structHoursSC: form["structHoursSC"],
    structHoursLB: form["structHoursLB"],
    structHoursPR: form["structHoursPR"],
    structHoursCL: form["structHoursCL"],
  };
  Object.keys(structHours).forEach(outerKey => {
    const innerObject = structHours[outerKey];
    const totalHours = innerObject.totalHours;
    // Check if totalHours is a non-empty string representing a number
    if (totalHours !== null && totalHours !== "" && !isNaN(parseFloat(totalHours))) {
    setTotalHoursSum((prev)=> prev+parseFloat(totalHours));
    }});
});
},[form]);

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
        if(Object.entries(inputsValid).length === 0){
          return;
        }
        if ( Object.values(inputsValid).every((validation) =>
        Object.values(validation).every((isValid) => isValid === true))) { //checking all validations
          setFormIsValid((prev)=> {return{...prev ,"MUSTH":true}});
        } else {
          setFormIsValid((prev)=> {return{...prev ,"MUSTH":false}});
        }
      }, [inputsValid]);
      const onchange=(e,fieldName)=>{
        setForm((prev) => {
          console.log(prev);
          return { ...prev, ["unStructHours"]:{...prev["unStructHours"],[fieldName]:{...prev["unStructHours"][fieldName],[e.target.name]:e.target.value} }};
        });
        setForm((prev) => {
          console.log(prev[fieldName]);
          return { ...prev,["unStructHours"]:{...prev["unStructHours"], [fieldName]:{...prev["unStructHours"][fieldName],totalHours:+prev["unStructHours"][fieldName]["noHours"]* +prev["unStructHours"][fieldName]["noWeeks"]}} };
        });
      }
      const blurHandler=(e,fieldName)=>{
        setFieldTouched((prev) => {
          console.log(prev);
          return { ...prev, [fieldName]:{...prev[fieldName],[e.target.name]:true} };
        });
      };
    return(
        <>
      <div className={classes.mainContainer}>
        {<Alert severity={form.module.length ? +selectedModule.ECTS * 25 < +totalHoursSum ? "error":"success":"info"}>The total structured and unstructured hours for the semester is {totalHoursSum} </Alert>}
        <div > <AddUnstructHours setForm={setForm} setTrigger={setTrigger} setFieldTouched={setFieldTouched}/></div>
        <ul className={classes.listContainer}>
       {fields.map(({ key, value })=>{
        console.log(key,value);
        console.log(fieldTouched);
            return(
     <li key={key + value}>
        <h3>{key}</h3>
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
          value={form["unStructHours"][key]["noWeeks"]}
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
          value={form["unStructHours"][key]["noHours"]}
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
          value={form["unStructHours"][key]["totalHours"]}
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
    </>
    )
}
export default ModuleUnStructuredHours;

