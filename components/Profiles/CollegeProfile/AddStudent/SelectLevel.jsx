import { ErrorMessage, Field, FormikContext, useFormikContext } from "formik";
import "./AddStudent.css";
import { useContext, useEffect } from "react";
import { get_prog, get_progs } from "../../../../store/getandset";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../../../store/fire";
const SelectLevel = ({programs}) => {
const formik=useFormikContext();
console.log(formik.values.maxlevel);
const loop=()=>{
  const arr=[];
  for (let index = 0; index < formik.values.maxlevel; index++) {
    
   arr.push(<option value={index+1}>{index+1}</option>)
  }
  return arr;
}
useEffect(()=>{
 
},[formik.values.program])
  return (
    <span className="spanflex">
    <label htmlFor="level" className="mylabel">
      Level
    </label>
   
 
    <Field as="select" name="level" className="myselect">
    {(loop())} 
    </Field>
    </span>
  );
};
export default SelectLevel;
