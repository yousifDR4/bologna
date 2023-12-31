import { useEffect, useState } from "react";
import classes from "./BachelorFour.module.css";
import AddProgram from "./AddProgram";
import PreviewBachelor from "./PreviewBachelor";
import { get_prog } from "../../../../store/getandset";
import { auth } from "../../../../store/fire";
import { useSelector } from "react-redux";
import Loader from "../../../UI/Loader/Loader";
import HOC from "./HOC";
// let Program1={
//     activated:true,
//     ECTS:240,
//     levels:4,
//     name:"ICE Bachelor's degree",
//     code:"BSc-ICE",
//     eveningStudy:true,
//     summerInternhsip:true,
//     summerInternhsipYear:3,
//     speciality:true,
// }
const BachelorFive = ({
  ECTS,
  levels,
  profile,
  Department_id,
  program,
  loading,
  showAddProgram,
  clickHandler,
}) => {
  console.log(ECTS);
  console.log(program,"program");
  console.log(showAddProgram, "showwwwwwwwww");

  return (
    <>
       {program?.activated ===true ?(<PreviewBachelor program={program} />):(<>
        {showAddProgram && (
            <div className={classes.add}>
              <AddProgram showAddProgram={showAddProgram} ECTS={ECTS} />
            </div>
          )}
          {showAddProgram && (
            <div className={classes.backDrop} onClick={clickHandler}></div>
          )}
          
          <div className={classes.container}>
            <div className={classes.info}>
              <h2> Program Information</h2>
              <div>
                <span>
                  <p>{ECTS}</p>
                  <p>ECTS</p>
                </span>
                <span>
                  <p>{levels}</p>
                  <p>Levels</p>
                </span>
              </div>
            </div>
            <div className={classes.message}>
              {" "}
              <h2>
                This Prbhbogram is not activated yet! Press on activate program
                button below!
              </h2>
            </div>
            <button onClick={clickHandler}>Activate Program</button>
          </div>
       </>)}   
      </>   
  );
};
export default HOC(BachelorFive);