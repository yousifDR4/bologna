import React from "react";
import classes from "./Schedule.module.css";
import Days from "./Days";

const Schedule = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    ,
    "Saturday",
  ];
  return (
    <div className={classes.over}>
      <div className={classes.grid}>
        {daysOfWeek.map((val, index) => (
          <Days name={val} />
        ))}
      </div>
    </div>
  );
};
export default Schedule;
