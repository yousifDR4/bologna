import { useState } from "react";
import { useDispatch } from "react-redux";
import CustomInput from "./CustomInput";
import classes from "./AboutComponent.module.css";
import options from "../../../Images/option.png";
import { profileActions } from "../../../store/profile-slice";
import { update_user_profile } from "../../../store/fire";
const AboutComponent=(probs)=>{
    const {icon,value,type,socialType}=probs;
    const dataType=socialType ? socialType : type;
    const [showDropDown,setShowDropDown]=useState(false);
    const [showEdit,setShowEdit]=useState(false);
    const disptach=useDispatch();
    const isValueNotEmpty=value ? value.length >0 ? true:false:false;
    console.log(isValueNotEmpty);
    const deleteHandler=async ()=>{
        disptach(profileActions.setProfileValue({type:dataType,value:""}))
        await update_user_profile({[dataType]:""});
    }
    return(
    <>
    {!isValueNotEmpty || showEdit && 
      <CustomInput type={type} value={value} showFormDefault={showEdit} defaultSelection={socialType} showEdit={setShowEdit}/> 
    }
    {(isValueNotEmpty && !showEdit) &&
    <span className={classes.container}>
        {icon.length > 0 && <img src={icon} alt=""/>} 
         {type !== "details" && <a href={value}>{value}</a>}
         {type === "details" && <p>{value}</p>}
         <img src={options} alt="" onClick={()=>setShowDropDown((prev)=>{return(!prev)})}/>
         <div  className={`${classes.dropDown} ${showDropDown?classes.active:''}`}>
            <span onClick={deleteHandler}>Delete</span>
           <span onClick={()=>{setShowEdit(true); setShowDropDown(false)}}>Edit</span>
         </div>
    </span>}
    </>
);
}
export default AboutComponent;