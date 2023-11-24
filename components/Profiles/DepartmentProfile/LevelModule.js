import AddModule from "./AddModule";
import classes from "./LevelModules.module.css";
import { useEffect, useState } from "react";
import { and, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../store/fire";
import downArrow from "../../../Images/downArrow.png";
var special = ['zeroth','First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
var deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];
function stringifyNumber(n) {
  if (n < 20) return special[n];
  if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + "ieth";
  return deca[Math.floor(n / 10) - 2] + "y-" + special[n % 10];
}
const LevelModule = (probs) => {
  const [showModules, setShowModules] = useState(false);
  const [showAddModule, setShowAddModule] = useState(false);
  const [course, setCourse] = useState("");
  let { level } = probs;
  let level_title = stringifyNumber(level);
  const [firstCourseModules, setfirstCourseModules] = useState([]);
  const [secondCourseModules, setsecondCourseModules] = useState([]);
  const addModuleHanlder = (course) => {
    setShowAddModule(true);
    setCourse(course);
  };

  useEffect(() => {
    const f = async () => {
      try{
      const q1 = query(
        collection(db, "subjects"),
        and(where("level", "==", level), where("course", "==", "1"))
      );
      const q2 = query(
        collection(db, "subjects"),
        and(where("level", "==", level), where("course", "==", "2"))
      );
      const [docs1, docs2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      let d1 = docs1.docs.map((doc) => doc.data());
      console.log(d1);
      let d2 = docs2.docs.map((doc) => doc.data());
      console.log(d2);
      setfirstCourseModules(d1);
      setsecondCourseModules(d2);
      }
      catch(e){
     console.log(e);
      }
    };
    f();
  }, []);
  return (
    <>
  <div className={`${showAddModule? classes.active:""} ${classes.addModule}`}><AddModule course={course} level={level} showAddModule={setShowAddModule}/> </div>
   {showAddModule && <div className={classes.backDrop} onClick={()=>setShowAddModule(false)}/>}
    <li className={classes.level} >
        <span onClick={()=>setShowModules((prev)=>!prev)}>
            <h3 >{level_title + " Level Modules"}</h3>
            <img src={downArrow} className={`${showModules ? classes.active :""}`}/>
        </span>
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
                {secondCourseModules
                  ? secondCourseModules.length > 0
                    ? secondCourseModules.map((module) => {
                        return <li key={module.name}>{module.name}</li>;
                      })
                    : ""
                  : ""}
                <li onClick={() => addModuleHanlder("2")}>+</li>
              </ul>
            </div>
          </div>}
      </li>
    </>
  );
};
export default LevelModule;
