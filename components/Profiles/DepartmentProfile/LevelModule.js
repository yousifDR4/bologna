import AddModule from "./AddModule";
import classes from "./LevelModules.module.css";
import { useState } from "react";
var special = ['zeroth','First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
var deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];
function stringifyNumber(n) {
  if (n < 20) return special[n];
  if (n%10 === 0) return deca[Math.floor(n/10)-2] + 'ieth';
  return deca[Math.floor(n/10)-2] + 'y-' + special[n%10];
}
const LevelModule=(probs)=>{
    const [showModules,setShowModules]=useState(false);
    const [showAddModule,setShowAddModule]=useState(false);
    const [course,setCourse]=useState("");
    let {level}=probs;
    let level_title=stringifyNumber(level);
    let firstCourseModules=[
        {name:"Electronic Circuits"},
        {name:"Mathmatics I"},
        {name:"Programming"},
        {name:"Human Rights"}
    ];
    let secondCourseModules=[
        {name:"Physics"},
        {name:"Mathmatics II"},
        {name:"Programming Paradigms"},
        {name:"ALBa'th Violations"}
    ];
    const addModuleHanlder=(course)=>{
        setShowAddModule(true);
        setCourse(course);
    }
return(
    <>
  <div className={`${showAddModule? classes.active:""} ${classes.addModule}`}><AddModule course={course}/> </div>
   {showAddModule && <div className={classes.backDrop} onClick={()=>setShowAddModule(false)}/>}
    <li className={classes.level} onClick={()=>setShowModules((prev)=>!prev)}>
        <h3>{level_title + " Level Modules"}</h3>
        {showModules && <div className={classes.coursesContainer}>
           <div>
                 <h4>First Course</h4>
                <ul>
                {firstCourseModules ? firstCourseModules.length >0 ?firstCourseModules.map((module)=>{
                    return <li key={module.name}>{module.name}</li>
                }):"":""}
                 <li onClick={()=>addModuleHanlder("1")}>+</li>
                </ul>
            </div>
            <div>
                 <h4>Second Course</h4>
                <ul>
                { secondCourseModules? secondCourseModules.length>0 ?secondCourseModules.map((module)=>{
                    return <li key={module.name}>{module.name}</li>
                }):"":""}
                <li onClick={()=>addModuleHanlder("2")}>+</li>
                </ul>
            </div>
        </div>}
    </li>
    </>
)
}
export default LevelModule;