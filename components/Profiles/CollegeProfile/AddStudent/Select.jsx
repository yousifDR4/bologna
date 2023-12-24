import { ErrorMessage, Field, FormikContext, useFormikContext } from "formik";
import "./AddStudent.css";
import { useContext, useEffect } from "react";
import { get_prog, get_progs } from "../../../../store/getandset";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../../../store/fire";
const SelectLevel = ({programs}) => {
const formik=useFormikContext();
console.log(formik.values.department);
useEffect(()=>{
    const f=async()=>{
    const id=formik.values.department;
    const d=await get_progs(id)
    formik.setFieldValue("programs",d)
   
    }
    f();
},[formik.values.department])
useEffect(()=>{
    try{
    const level=formik.values.programs[0].type?formik.values.programs[0].type:formik.values.programs[0].level;
  
    formik.setFieldValue("maxlevel",level);
    }
    catch(e){
        
    }

},[formik.values.programs])
const changemaxlevel=(e)=>{
const max=formik.values.programs.filter((prog)=>prog.id===e.target.value)[0].type;
console.log(max);
formik.setFieldValue("maxlevel",max);
}
  return (
    <select className="myselect" name="program" onChange={(e)=>{formik.handleChange(e);
        changemaxlevel(e);
    }} value={formik.values.program}>
        {formik.values.programs.length > 0 ? (
          formik.values.programs.map((prog) => (
            <option key={prog.name} value={prog.id}>
              {prog.name}
            </option>
          ))
        ) : (
          <></>
        )}
 
          
      </select>
  );
};
export default SelectLevel;