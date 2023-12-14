import { useState } from "react";
import options from "../../../../Images/option.png";
import classes from "../Modules_s/Options.module.css";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../../store/fire";
const Options=(probs)=>{
    const [showDropDown,setShowDropDown]=useState(false);
    const navigate=useNavigate();
    let {classroom}=probs;
    const deleteHandler=async()=>{
        //classroom.id -> id
        const userRef=doc(db,"users",auth.currentUser.uid);
        console.log("works");
       try{
        await deleteDoc(doc(userRef,"classRooms",classroom.id));
        probs.updateTable();
       }
       catch(e){

       }

    }
    const editHandler=()=>{
        console.log(classroom);
        probs.showAdd(true,classroom);
    }
    return(
        <><img src={options} className={classes.img }onClick={()=>setShowDropDown((prev)=>!prev)}/> <div  className={`${classes.dropDown} ${showDropDown?classes.active:''}`}>
            <span onClick={deleteHandler}>Delete</span>
           <span onClick={editHandler}>Edit</span>
         </div></>
    )
}
export default Options;