import React, { useState,  cloneElement, useEffect } from "react";
import { auth, creatuser, db } from "../../../store/fire";
import classes from "./AddLevel.module.css";
import { getIdToken } from "firebase/auth";
import { useSelector } from "react-redux";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
  
} from "firebase/firestore";
function sortedIndex(array, value) {
  var low = 0,
      high = array.length;

  while (low < high) {
      var mid = (low + high) >>> 1;
      if (array[mid] < value) low = mid + 1;
      else high = mid;
  }
  return low;
}

const AddLevel = (probs) => {
  let AllLevels=[1,2,3,4,5,6];
  const {levels:l}=probs
  const [levels,setlevels]=useState(l);
  const filteredLevels=AllLevels.filter((x)=>{
    if (!levels) {
      console.log(levels,"unnnnnffwo");
      return x;
    }
    console.log(levels,"o");
    console.log(!levels.includes(x));
    return !levels.includes(x)});
  const [selectedLevel,setSelectedLevel]=useState(filteredLevels[0]);  
  const profile = useSelector((state) => state.profile.profile);

  function onchange(e) {
   setSelectedLevel(e.target.value);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try{
      let temp = [];
    console.log(levels,"l");
    if (levels.length!==0) {
   levels.forEach((val,i)=>{
    temp.push(val);
   })
  }
      if (temp.length===0) {
        temp[0]=+selectedLevel;
        console.log(selectedLevel);
        setlevels (temp);
       
        console.log(levels);
        setSelectedLevel(filteredLevels[0])
        await setDoc(doc(db,"users",auth.currentUser.uid),{levels:[+selectedLevel]},{merge:true});
        
      }
      else if(!temp.includes(+selectedLevel)){
      temp.push(+selectedLevel);
      let sortedArrayAsc = temp.slice().sort((a, b) => a - b);
      setlevels(sortedArrayAsc);
      // course is variable indicating course number with values 1 or 
      setSelectedLevel(filteredLevels[0])
      await setDoc(doc(db,"users",auth.currentUser.uid),{levels:sortedArrayAsc},{merge:true}); 
      
      }
    }
  catch(e){
    console.log(e);
  }

  probs.showAddLevel(false);
  probs.reload((prev)=>!prev);
  };
console.log(filteredLevels);
  return (
    <div className={`${classes.container}`}>
      <form action="" className=" form">
        <h3>Add Level</h3>
        <label htmlFor="email">
          Level<span className={classes.star}>*</span>
        </label>
        <select
          name="level"
          id="level"
          onChange={onchange}
          value={selectedLevel}
        >
            {
                filteredLevels.map((level)=>{
                    return<option value={level}>{level}</option>
                })
            }
            </select>
        <div className={classes.button}>
          {" "}
          <button onClick={submitHandler}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddLevel;
