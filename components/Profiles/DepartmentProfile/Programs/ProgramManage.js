import React, { memo, useMemo } from "react";
import classes from "./ProgramManage.module.css";
import { useState, useContext } from "react";
import BachelorFour from "./BachelorFour";
import Speciality from "./Speciality";
import AddProgram from "./AddProgram";
import AddNewModule from "../Modules_s/AddNewModule";
import AddProgramModule from "./AddProgramModule";
import BachelorFive from "./BachelorFive";
const MemorizeBachelorFour =memo(BachelorFour);
const MemorizeBachelorFive=memo(BachelorFive );
const ProgramManage = () => {
  const [state,setstate]=useState(true);
  const [program, setProgram] = useState(4);
//const memorizeBachelorFour=useMemo(()=> <MemorizeBachelorFour ECTS="240" levels="4" 
// state={state} />,[state]) reender
 // const memorizeBachelorFive=useMemo(()=> <MemorizeBachelorFive ECTS="320" levels="5"
 // state ={state}/>,[]) doesnt rerender
  const memorizeBachelorFour=useMemo(()=> <MemorizeBachelorFour ECTS="240" levels="4"/>,[])
  const memorizeBachelorFive=useMemo(()=> <MemorizeBachelorFive ECTS="320" levels="5"/>,[])
  const [rightContainer, setRightContainer] = useState(
    memorizeBachelorFour
  );
  const [header, setHeader] = useState({
    title: "Bachelor's 4 Years",
    desc: "Manage Bachelor's 4 Years Program..",
  });
  const clickHandler = (probs) => {
    switch (probs) {
      case "bach4":
        console.log("4");
        setRightContainer(() =>memorizeBachelorFour);
        setProgram(4);
        setHeader({
          title: "Bachelor's 4 Years",
          desc: "Manage Bachelor's 4 Years Program.",
        });
        break;
      case "bach5":
        setRightContainer(memorizeBachelorFive);
        setProgram(5);
        setHeader({
          title: "Bachelor's 5 Years",
          desc: "Manage Bachelor's 5 Years Program.",
        });
        break;
    }
  };
  return (
    <main className={classes.mainContainer}>
      <div className={classes.secondaryContainer}>
        <aside className={classes.sideContainer}>
          <div>
            <h3>Program types</h3>
          </div>
          <ul>
            <li
              onClick={() =>clickHandler("bach4")}
              className={`${
                header.title == "Bachelor's 4 Years" ? classes.activeLink : ""
              }`}
            >
              Bachelor's 4 Years
            </li>
            <li
              onClick={() => clickHandler("bach5")}
              className={`${
                header.title == "Bachelor's 5 Years" ? classes.activeLink : ""
              }`}
            >
              Bachelor's 5 Years
            </li>
          </ul>
        </aside>
        <div className={classes.rightContainer}>
          <div className={classes.header}>
            <h3>{header.title}</h3>
            <p>{header.desc}</p>
          </div>
          <div className={classes.body}>{rightContainer}</div>
        </div>
      </div>
      <div className={classes.speciality}>
        <h3>Specialities</h3>
        <Speciality program={program} />
      </div>
    </main>
  );
};
export default ProgramManage;