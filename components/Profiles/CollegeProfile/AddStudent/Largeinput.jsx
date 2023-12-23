import { Field, Formik } from "formik";
import { useState } from "react";
const Largeinput = (probs) => {
    return (
      <span className="spanflex">
        <label htmlFor={probs.name} className="mylabel">
          *{probs.word}
        </label>
        <Field
          type="text"
          name={probs.name}
          className="myemail"
        />
      </span>
    );
  
  
  };
  export default Largeinput;