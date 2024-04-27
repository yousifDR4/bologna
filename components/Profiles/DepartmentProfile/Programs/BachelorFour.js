import { useEffect, useState } from "react";
import classes from "./BachelorFour.module.css";
import AddProgram from "./AddProgram";
import PreviewBachelor from "./PreviewBachelor";
import HOC from "./HOC";
const BachelorFour = ({
  ECTS,
  levels,
  program,
  showAddProgram,
  clickHandler,
  setShowAddProgram
}) => {
  return (
    <>
       {program?.activated ===true ?(<PreviewBachelor program={program} ECTS={ECTS} levels={levels} />):(<>
        {showAddProgram && (
            <div className={classes.add}>
              <AddProgram showAddProgram={setShowAddProgram} ECTS={ECTS} />
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
export default HOC(BachelorFour);
