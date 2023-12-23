import { Field, FormikContext } from "formik";
import "./AddStudent.css";
const Smallinput = (probs) => {
  
  
  return (
    <span className="spanflex">
      <label htmlFor={probs.name}className="mylabel">
        {probs.word}
      </label>
      <Field
        type={probs.type}
        name={probs.name}
      
        className="myform"
        />
    </span>
  );
};
export default Smallinput;
