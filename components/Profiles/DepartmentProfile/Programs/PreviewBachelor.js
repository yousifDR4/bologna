import { useSelector } from "react-redux";
import classes from "./PreviewBachelor.module.css"
import { useState } from "react";
import DisplayLevels from "./DisplayLevels";
let Program={
    activated:true,
    ECTS:240,
    levels:4,
    name:"ICE Bachelor's degree",
    code:"BSc-ICE",
    eveningStudy:true,
    summerInternhsip:true,
    summerInternhsipYear:3,
    speciality:true,
}

const PreviewBachelor=(probs)=>{
    const profile=useSelector(state=> state.profile.profile);
    const {program,levels,ECTS}=probs;
    const x=[]
    for (let i = 0; i < +program.type; i++) {
        x.push(<DisplayLevels key={i} index={i} type={program.type} />);
    }
    console.log(program);
    return(
        <div className={classes.container}>
            <div className={classes.info}>
                <h2> Program Information</h2>
                <div>
                <span>
                <p>{ECTS}</p>
                <p>ECTS</p>
                </span>
                <span>
                 <p>{levels}</p>
                 <p>Levels</p>
                </span>
                </div>
            </div>
            <div className={classes.levels}>
                <h2> Levels</h2>
                <span>{x}</span>
            </div>
            <div className={classes.details}>
                <h2>Program Details</h2>
                <div>
                <span>
                    <p>Program Name</p>
                    <p>{program.name}</p>
                </span>
                <span>
                    <p>Code</p>
                    <p>{program.code}</p>
                </span>
                <span>
                    <p>Evening Study</p>
                    <p>{program.eveningStudy == "true" ?"exists" :"doesn't exist" }</p>
                </span>
                <span>
                    <p>Summer Internship</p>
                    <p> {program.summerInternhsip == "true"? "exists":"doesn't exist"}</p>
                </span>
                <span>
                    <p>Department</p>
                    <p>{profile.name}</p>
                </span>
                <span>
                    <p></p>
                    <p></p>
                </span>
                <span>
                    <p></p>
                    <p></p>
                </span>
            </div></div>
        </div>
    );
}
export default PreviewBachelor;