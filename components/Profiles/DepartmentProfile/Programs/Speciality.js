 import { useEffect, useState } from "react";
 import Loader from "../../../UI/Loader/Loader";
import classes from "./Speciality.module.css";
const stSp=[
    {
        name:"ICE",
        requestedModules:["Physics","Math"],
        stuedentNum:0,
        id:"01"
    }
];
 const Speciality=()=>{
    const [specialities,setSpecialities]=useState(stSp);
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        setLoading(true);
        setSpecialities(stSp);
        console.log(specialities);
        setLoading(false);
    },[])
    if(loading){
        return <Loader/>
    }
    else{
    return(
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
        <tr id={speciality.id}>
            <td>{speciality.name}</td>
            <td>{speciality.requestedModules}</td>
            <td>{speciality.stuedentNum}</td>
        </tr>);
    })}
    </tbody>
</table>
    )}
 };
 export default Speciality;