import { useEffect, useState } from "react";
import "./AddStudent.css";
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
    className={check+1==probs.name ? "blue-border" : ""}
    onClick={probs.selectStep}
    name={probs.name}
  >
   {probs.text}
  </li>);
};
export default SelectStep;
