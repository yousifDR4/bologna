import { useState } from "react";
import options from "../../../../Images/option.png";
import { useNavigate } from "react-router-dom";
import BasicMenu from "../../../UI/Menu.js";
const Options=(probs)=>{
    const navigate=useNavigate();
    let {id,code}=probs;
    const deleteHandler=(str)=>{
        //module code = code
        console.log(str);
    }
    const editHandler=()=>{
        navigate(`/EditModule?id=${id}`)
    }
    return(
      <BasicMenu menuItems={[{title:"Delete",handleClick:()=>deleteHandler("str")},{title:"Edit",handleClick:editHandler}]} menuTitle={<img src={options}/>}/>
    )
}
export default Options;