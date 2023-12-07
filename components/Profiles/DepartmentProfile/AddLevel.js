import React, { useState,  cloneElement } from "react";
import { auth, creatuser, db } from "../../../store/fire";
import classes from "./AddLevel.module.css";
import { getIdToken } from "firebase/auth";
import { useSelector } from "react-redux";
import {
  addDoc,
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
  let { levels } = probs;
  let AllLevels=[1,2,3,4,5,6];
  const filteredLevels=AllLevels.filter(x => !levels.includes(x));
  const [selectedLevel,setSelectedLevel]=useState(filteredLevels[0]);  
  const profile = useSelector((state) => state.profile.profile);

  function onchange(e) {
   setSelectedLevel(e.target.value);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    let modLevels=[];
    if(levels.length == 0){
      console.log(selectedLevel);
     levels.push(selectedLevel);
    }
    else{
    let index=sortedIndex(levels,selectedLevel);
    console.log(index,levels.length);
     if(index == levels.length){
     levels.push(+selectedLevel);
     console.log("inside");
     console.log(selectedLevel);
     console.log(levels);
    }
    else{
    modLevels=levels.splice(index,0,+selectedLevel);
    console.log(modLevels,index,levels);}
    }
    // course is variable indicating course number with values 1 or 2
    try{
           await setDoc(doc(db,"users",auth.currentUser.uid),{levels:levels},{merge:true}); 
    }
  catch(e){
    console.log(e);
  }
  probs.showAddLevel(false);
  probs.reload((prev)=>!prev);
  };
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
