import { ErrorMessage, Field, Formik } from "formik";
import { useState } from "react";
const Largeinput = (probs) => {
    return (
      <span className="spanflex">
        <label htmlFor={probs.name} className="mylabel">
        {probs.requried&& (<span className="spancolor">*</span>)}
          {probs.word}
        </label>
        <Field
          type={probs.type}
          name={probs.name}
          className="myemail"
        />
        <ErrorMessage name={probs.name} component="div"/>
      </span>
    );
  };
  export default Largeinput;