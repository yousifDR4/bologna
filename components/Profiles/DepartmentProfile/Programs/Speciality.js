 import { useEffect, useState } from "react";
 import Loader from "../../../UI/Loader/Loader";
 import addIcon from "../../../../Images/add.png"
import classes from "./Speciality.module.css";
import AddSpeciality from "./AddSpeciality";
const stSp=[
    {
        name:"ICE",
        requestedModules:["Physics","Math"],
        stuedentNum:0,
        id:"01"
    }
];
 const Speciality=(probs)=>{
    const {program}=probs;
    const [specialities,setSpecialities]=useState([]);
    const [loading,setLoading]=useState(false);
    const [showAdd,setShowAdd]=useState(false);
    useEffect(()=>{
        // when fitching, program type is program (4,5,6)
        setLoading(true);
        setSpecialities(stSp);
        console.log(specialities);
        setLoading(false);
    },[])
    if(loading){
        return <Loader/>
    }
    else if(specialities.length > 0){
    return(
        <>
        <table className={ classes.styledtable}>
    <thead>
        <tr>
            <th>Name</th>
            <th>Requested Modules</th>
            <th>Students Number</th>
        </tr>
    </thead>
    <tbody>
        { specialities.map((speciality)=>{
            return(
        <tr key={speciality.id}>
            <td>{speciality.name}</td>
            <td>{speciality.requestedModules.map((mod)=>{
                return mod + "  ";
            })}</td>
            <td>{speciality.stuedentNum}</td>
        </tr>);
    })}
    </tbody>
</table>
{showAdd &&<AddSpeciality showAdd={setShowAdd} program={program}/>}
{!showAdd && <div  className={classes.add} onClick={()=>setShowAdd(true)}><img src={addIcon} alt=""/><p>Add a new speciality</p></div>}
</>
    )}
    else{
        return(
<>{showAdd &&<AddSpeciality showAdd={setShowAdd}/>}
{!showAdd && <div  className={classes.add} onClick={()=>setShowAdd(true)}><img src={addIcon} alt=""/><p>Add a new speciality</p></div>}</>
        );
    }
 };
 export default Speciality;