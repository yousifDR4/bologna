import { useEffect, useState } from "react";
import "./EditStudent.css";
import { useFormikContext } from "formik";
const SelectStep = (probs) => {
    console.log(probs.name);
    const [check,setCheck]=useState(probs.check);
  
   useEffect(()=>{
    if(probs.check!==check)
   setCheck(probs.check)
   console.log(check);
   })
    return(
  <li
    onClick={probs.selectStep}
    name={probs.name}
  >
   {probs.text}
  <span  className={check+1==probs.name ? "blue-border" : ""}></span>
  </li> );
};
export default SelectStep;
