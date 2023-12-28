import { ErrorMessage, Field, FormikContext, useFormikContext } from "formik";
import "./AddStudent.css";
import { useContext, useEffect } from "react";
import { get_prog, get_progs } from "../../../../store/getandset";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../../../store/fire";
const SelectLevel = ({ programs }) => {
  const formik = useFormikContext();
  console.log(formik.values.maxlevel);
  const loop = () => {
    const arr = [];
const check=()=>{
return formik.values.program==="" &&formik.values.department===""? formik.values.program===""?
 "no department selected":"no departmentkkk selected":"no program selected"
}

    arr.push(
      <option value="">
        {formik.values.maxlevel===0?(check()):
        (<option value={""}>no level selected</option>)
      
        }
      </option>
    );
    console.log(formik.values.maxlevel, "level");

    for (let index = 0; index < formik.values.maxlevel; index++) {
      arr.push(<option value={index + 1}>{index + 1}</option>);
    }
    return arr;
  };
  useEffect(() => {}, [formik.values.program]);
  return (
    <span className="spanflex">
      <label htmlFor="level" className="mylabel">
        Level
      </label>
      <Field
        as="select"
        name="level"
        className="myselect"
        disabled={formik.values.program===""}
      >
        {loop()}
      </Field>
     {formik.values.program && (<ErrorMessage name={"level"} component="div"/>)}
    </span>
  );
};
export default SelectLevel;
