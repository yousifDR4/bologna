import { useEffect, useState } from "react";
import LevelModule from "./LevelModule";
import classes from "./Modules.module.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth ,db} from "../../../store/fire";
import AddLevel from "./AddLevel";

const Modules=(probs)=>{
    const [levels,setLevels]=useState([]);
    const [showAddLevel,setShowAddLevel]=useState(false);
    const [reload,setReload]=useState(false);
    useEffect(()=>{
        if (!auth.currentUser) return; 
     const f=async()=>{
        try{
            const level=(await getDoc(doc(db,"users",auth.currentUser.uid))).get("levels");
            if (level) {
             setLevels(level)
            console.log(level);
            }
            
        }
        catch(e){

        }
     }
     f();
    },[auth.currentUser,reload])
   
    const levelsContainer=[];
    for (let i in levels) {
        levelsContainer.push(<LevelModule key={levels[i]} level={levels[i]}/>);
    }
    
    return(
        <>
        {showAddLevel && <div className={`${classes.addLevel} ${showAddLevel?classes.active:""}`}><AddLevel levels={levels} reload={setReload} showAddLevel={setShowAddLevel}/></div>}
        {showAddLevel && <div className={classes.backDrop} onClick={()=>setShowAddLevel(false)}/>}
        <ul className={classes.modulesList}>
            <li onClick={()=>setShowAddLevel(true)}>+</li>
            {levelsContainer}
        </ul>
        </>
    )
}
export default Modules;