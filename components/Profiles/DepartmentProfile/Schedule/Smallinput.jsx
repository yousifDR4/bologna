import { ErrorMessage, Field, FormikContext } from "formik";
import classes from"./Schedule.module.css"
const Smallinput = (probs) => {  
  return (
    <div className={`${classes.Smallinputcont}`}>
      <label htmlFor={probs.name}>
      {probs.required&& (<span className="spancolor">*</span>)}
        {probs.word}
      </label>
      <Field
        type={probs.type}
        name={probs.name}
        className={`${classes.myform} `}
        />
      <ErrorMessage name={probs.name} component="div"/>
 </div>
  );
};
export default Smallinput;
