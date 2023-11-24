import { useState,useEffect } from "react";
import classes from "./UniversityAccounts.module.css";
import uob from "../../Images/UniversityofBaghdad.png";
import search from "../../Images/search.png";
import AddUniversity from "./AddUniversity";
import {db,auth} from "../../store/fire";
import{getDocs,where,collection,query, doc} from"firebase/firestore";
import { useSelector } from "react-redux";
import Loader from "../UI/Loader/Loader";
const universities=[];
const UniversityAccounts=()=>{
    const [university,setUniversity]=useState(universities);
    const [loading,setLoading]=useState(true);
    const [showAddUniversity,setShowAddUniversity]=useState(false);
    const [initalUniversityValue,setInitialUniversityValue]=useState(universities);
    const [searchValue,setSearchValue]=useState();
    const[debouncedSearchValue,setDebouncedSearchValue]=useState(searchValue);
    const accountType=useSelector(state=>state.auth.accountType);
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
            setLoading(false);
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
    if(loading){
        return(
            <Loader/>
        )
    }
    else{
    return(
        <main className={classes.main}>
       {accountType === "Admin" && <div className={`${classes.addUniversity} ${
                  showAddUniversity === true ? classes.active : ""
                }`}>
            <AddUniversity/>
        </div>}
        {showAddUniversity && <div className={classes.backDrop} onClick={()=>setShowAddUniversity(false)}/>}
      {accountType === "Admin" && <button className={classes.addUniversityButton} onClick={()=>setShowAddUniversity(true)}>
            +
        </button>}
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
    );}
}
export default UniversityAccounts;