import { useEffect, useState } from "react";
import classes from "./BachelorFour.module.css"
import AddProgram from "./AddProgram";
import PreviewBachelor from "./PreviewBachelor";
import { get_prog } from "../../../../store/getandset";
import { auth } from "../../../../store/fire";
import { useSelector } from "react-redux";
let Program1={
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
const BachelorFour=(probs)=>{
    let {ECTS,levels}=probs;
    console.log(ECTS,levels);
    const profile=useSelector(state=> state.profile.profile);
    let p=profile;
    const [program,setProgram]=useState({});
    const [showAddProgram,setShowAddProgram]=useState(false);
    useEffect(()=>{
       
        if(!auth.currentUser) return;
        //load Program (if exist (Activated))]
        const f=async()=>{
        const d=await get_prog();
      
            
        const obj=d[0]
        console.log(obj);
           
            setProgram(Program1);
         
        }
        f();
        
        

        // ;
    },[p])
    return(
        <>
        {!program.activated &&
        <>
        {showAddProgram && <div className={classes.add}><AddProgram showAddProgram={setShowAddProgram} ECTS={ECTS}/></div>}
        {showAddProgram && <div className={classes.backDrop} onClick={()=>setShowAddProgram(false)}></div>}

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
            <div className={classes.message}> <h2>This Program is not activated yet! Press on activate program button below!</h2></div>
            <button onClick={()=>{setShowAddProgram(true);}}>Activate Program</button>
        </div></>}
            {program.activated &&
                <PreviewBachelor program={program}/>
            }
        </>
    )
}
export default BachelorFour;