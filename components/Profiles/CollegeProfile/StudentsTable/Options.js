import { useState } from "react";
import options from "../../../../Images/option.png";
import classes from "./Options.module.css";
import { useNavigate } from "react-router-dom";
const Options=(probs)=>{
    const [showDropDown,setShowDropDown]=useState(false);
    const navigate=useNavigate();
    let {id}=probs;
    const deleteHandler=()=>{
    }
    const editHandler=()=>{
        navigate(`/EditStudent?id=${id}`)
    }
    return(
        <><img src={options} onClick={()=>setShowDropDown((prev)=>!prev)}/> <div  className={`${classes.dropDown} ${showDropDown?classes.active:''}`}>
            <span onClick={deleteHandler}>Delete</span>
           <span onClick={editHandler}>Edit</span>
         </div></>
    )
}
export default Options;