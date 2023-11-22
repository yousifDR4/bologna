import { useState } from "react";
import LevelModule from "./LevelModule";
import classes from "./Modules.module.css";
const Modules=(probs)=>{
    const [levels,setLevels]=useState(0);
    const levelsContainer=[];
    for (let i = 1; i <= levels; i++) {
        levelsContainer.push(<LevelModule key={i} level={i}/>);
    }
    const addLevel=()=>{
        setLevels((prev)=>{
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