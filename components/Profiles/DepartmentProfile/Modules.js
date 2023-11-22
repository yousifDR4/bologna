import { useEffect, useState } from "react";
import LevelModule from "./LevelModule";
import classes from "./Modules.module.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth ,db} from "../../../store/fire";

const Modules=(probs)=>{

    const [levels,setLevels]=useState(0);
    useEffect(()=>{
        if (!auth.currentUser) return; 
     const f=async()=>{
      
            const level=(await getDoc(doc(db,"users",auth.currentUser.uid))).get("levels");
            setLevels(level)
            console.log(level);
     }
     f();
    },[auth.currentUser])
   
    const levelsContainer=[];
    for (let i = 1; i <= levels; i++) {
        levelsContainer.push(<LevelModule key={i} level={i}/>);
    }
    const addLevel=async()=>{
        setLevels((prev)=>{
            setDoc(doc(db,"users",auth.currentUser.uid),{levels:prev+1},{merge:true})
            return prev=prev+1;
        });
        
    }
    return(
        <ul className={classes.modulesList}>
            <li onClick={()=>addLevel()}>+</li>
            {levelsContainer}
        </ul>

    )
}
export default Modules;