import React from "react";
import classes from "./Loading.module.css"; // Make sure to create a corresponding CSS module file

const Loading = () => {
  return (
    <div className={classes.LoadingContainer}>
      <div className={classes.Loading}>
        <div className={classes.Spinner}></div>
      </div>
    </div>
  );
};

export default Loading;
