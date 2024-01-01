import { ErrorMessage, Field, FormikContext } from "formik";
import "./EditStudent.css";
const Smallinput = (probs) => {  
  return (
    <span className="spanflex">
      <label htmlFor={probs.name}className="mylabel">
      {probs.required&& (<span className="spancolor">*</span>)}
        {probs.word}
      </label>
      <Field
        type={probs.type}
        name={probs.name}
        className="myform"
        />
      <ErrorMessage name={probs.name} component="div"/>
    </span>
  );
};
export default Smallinput;
