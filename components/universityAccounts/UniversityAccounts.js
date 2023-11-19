import { useState,useEffect } from "react";
import classes from "./UniversityAccounts.module.css";
import uob from "../../Images/UniversityofBaghdad.png";
import search from "../../Images/search.png";
import AddUniversity from "./AddUniversity";
import {db,auth} from "../../store/fire";
import{getDocs,where,collection,query, doc} from"firebase/firestore";
const universities=[];
const UniversityAccounts=()=>{
    const [university,setUniversity]=useState(universities);
    const [initalUniversityValue,setInitialUniversityValue]=useState(universities);
    const [searchValue,setSearchValue]=useState();
    const[debouncedSearchValue,setDebouncedSearchValue]=useState(searchValue);
    useEffect(()=>{
        const f=()=>{
     const q=query(collection(db,"users"),where("accountType","==","University"))
        getDocs(q).then((res)=>{
            const s=res.docs.map((doc)=>{return{...doc.data(),img:doc.data().profilePicture?doc.data().profilePicture:uob,name:doc.data().name?doc.data().name:"un"}});
            console.log(s[1]);
            if(!s)
            return;
            setInitialUniversityValue(s)
            setUniversity(s)
        })
        }
        f();
    },[])
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchValue(searchValue), 1000);
        return () => clearTimeout(timer);
    }, [searchValue])
    
    useEffect(() => {
    performSearch(debouncedSearchValue);
     
    }, [debouncedSearchValue]);
    const performSearch=(value)=>{
        console.log(11);
        if(value){
            console.log("enter");
        if(value.trim() !== ""){
        setUniversity(initalUniversityValue.filter((university)=>university.name.toLowerCase().match(value.toLowerCase())));}
        else{
           
            console.log(university);
        }}
        else{
            setUniversity(initalUniversityValue);

        }
    }
    const searchChangeHandler=(e)=>{
        setSearchValue(e.target.value);
    } 
    return(
        <main className={classes.main}>
        <div className={classes.addUniversity}>
            <AddUniversity/>
        </div>
        <div className={classes.universities}>
        <div className={classes.searchBar}> <div><img src={search}/></div><input type="text" value={searchValue} onChange={searchChangeHandler} placeholder="search university..."></input> </div>
        <ul >
        {university.map((university)=>
         <li key={university.uid}>
             <img src={university.img} alt=""/> 
             <div><p>{university.name}</p> <span></span> <br/> 
             </div>
         </li>
        )} 
     </ul>
     </div>
     </main>
    );
}
export default UniversityAccounts;