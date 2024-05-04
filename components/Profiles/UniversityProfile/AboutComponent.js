import { useState } from "react";
import { useDispatch } from "react-redux";
import CustomInput from "./CustomInput";
import classes from "./AboutComponent.module.css";
import options from "../../../Images/option.png";
import { profileActions } from "../../../store/profile-slice";
import { update_user_profile } from "../../../store/fire";
import { Menu, MenuItem } from "@mui/material";
const AboutComponent=(probs)=>{
    const {icon,edit=true,value,type,socialType}=probs;
    const dataType=socialType ? socialType : type;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
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
    {((!isValueNotEmpty || showEdit) && edit )&& 
      <CustomInput type={type} value={value} showFormDefault={showEdit} defaultSelection={socialType} showEdit={setShowEdit}/> 
    }
    {(isValueNotEmpty && !showEdit) &&
    <span className={classes.container}>
        {icon.length > 0 && <img src={icon} alt=""/>} 
         {type !== "details" && <a href={value}>{value}</a>}
         {type === "details" && <p>{value}</p>}
         <img src={options} alt="" onClick={handleClick}/>
         {edit &&
         <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={()=>{setShowEdit(true); handleClose();}}>Edit</MenuItem>
        <MenuItem onClick={deleteHandler}>Delete</MenuItem>
      </Menu>
}
         {/* <div  className={`${classes.dropDown} ${showDropDown?classes.active:''}`}>
            <span onClick={deleteHandler}>Delete</span>
           <span onClick={()=>{setShowEdit(true); setShowDropDown(false)}}>Edit</span>
         </div> */}
    </span>}
    </>
);
}
export default AboutComponent;