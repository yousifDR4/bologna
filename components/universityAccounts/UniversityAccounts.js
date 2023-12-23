import { useState, useEffect, useRef } from "react";
import classes from "./UniversityAccounts.module.css";
import uob from "../../Images/UniversityofBaghdad.png";
import search from "../../Images/search.png";
import AddUniversity from "./AddUniversity";
import { db, auth } from "../../store/fire";
import {
  getDocs,
  where,
  collection,
  query,
  doc,
  onSnapshot,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import Loader from "../UI/Loader/Loader";
import { usePaginationFetch } from "../../hooks/usePaginationFetch";
import PlaceHolderLoader from "../UI/Loader/PlaceHolderLoader";
import { current } from "@reduxjs/toolkit";
import { useCallback } from "react";
const universities = [];
const UniversityAccounts = () => {
  const setRef = useRef(true);
  const [university, setUniversity] = useState(universities);
  const [loading, setLoading] = useState(true);
  const [showAddUniversity, setShowAddUniversity] = useState(false);
  const [initalUniversityValue, setInitialUniversityValue] =
    useState(universities);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const accountType = useSelector((state) => state.auth.accountType);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id=profile.Department_id;
  const [nextdoc, setnextdoc] = useState(null);
  const fetchRef = useRef(true);
  const updateRef = useRef(false);
  const limitNumber =5;
  const q1 = query(
    collection(db, "users"),
    where("accountType", "==", "University"),
    orderBy("name"),
    limit(limitNumber)
  );
  const q2 = query(
    collection(db, "users"),
    where("accountType", "==", "University"),
    orderBy("name"),
    limit(limitNumber),
    startAfter(nextdoc)
  );
  
  const { data, load: myload } = usePaginationFetch(
    nextdoc,
    fetchRef.current,
    limitNumber,
    updateRef,q1,q2
  );
  useEffect(() => {
    const f = async () => {
      try {
        if (data.length > 0) {
          const s = data.map((doc) => {
            return {
              ...doc.data(),
              img: doc.data().profilePicture ? doc.data().profilePicture : uob,
              name: doc.data().name ? doc.data().name : "un",
              id: doc.id,
            };
          });

          setUniversity((prev) => {
            return [...prev, ...s];
          });
          setInitialUniversityValue((prev) => {
            return [...prev,...s];
          });
          fetchRef.current = false;
          console.log("length", data.length);
        
        } else {
          console.log(444);
          
        }
      } catch (e) {
        console.log(e);
      }
    };
    f();
  }, [data]);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchValue(searchValue), 1000);
    return () => clearTimeout(timer);
  }, [searchValue]);
  useEffect(() => {
      
    performSearch(debouncedSearchValue);
  }, [debouncedSearchValue,initalUniversityValue]);
  const performSearch = (value) => {
    console.log(11);
    if (value) {
      console.log("enter");
      if (value.trim() !== "") {
        setUniversity(
          initalUniversityValue.filter((university) =>
            university.name.toLowerCase().match(value.toLowerCase())
          )
        );
      } else {
        setUniversity(initalUniversityValue);
      }
    } else {
      setUniversity(initalUniversityValue);
    }
  };
  const searchChangeHandler = (e) => {
    setSearchValue(e.target.value);
  };
  const observer=useRef()
  const updateUniversity = () => {
    console.log(nextdoc);
    observer.current.disconnect();
    console.log("work");
    setnextdoc(null);
   updateRef.current=!updateRef.current;
    fetchRef.current = true;
    setUniversity([]);
    setInitialUniversityValue([]);

  };
  const last = useCallback( (element)=>{
    if (myload) {
      return;
    }
    console.log(element);
   
    if(observer.current)
    observer.current.disconnect();
    observer.current=new IntersectionObserver(entry=>{
      if (entry[0].isIntersecting) {
        console.log("visable");
          if (data.length === limitNumber) setnextdoc(data[limitNumber - 1]);
         console.log(data.length);
      }
      else{
        console.log("not visable");
        if (searchValue!=="") {
          if (data.length === limitNumber) setnextdoc(data[limitNumber - 1]);
          
        }
      }
    })
   if(element)
    observer.current.observe(element);
    console.log(element);
  },[myload,nextdoc])
  return (
    <main className={classes.main}>
      {accountType === "Admin" && (
        <div
          className={`${classes.addUniversity} ${
            showAddUniversity === true ? classes.active : ""
          }`}
        >
          <AddUniversity updateUniversity={updateUniversity} />
        </div>
      )}
      {showAddUniversity && (
        <div
          className={classes.backDrop}
          onClick={() => setShowAddUniversity(false)}
        />
      )}
      {accountType === "Admin" && (
        <button
          className={classes.addUniversityButton}
          onClick={() => setShowAddUniversity(true)}
        >
          +
        </button>
      )}
      <div className={classes.universities}>
        <div className={classes.searchBar}>
          {" "}
          <div>
            <img src={search} />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={searchChangeHandler}
            placeholder="search university..."
          ></input>{" "}
        </div>
        <ul>
          {university.map((uni,index) => {
       if(index+1===university.length)
       return(
        <li key={uni.uid} ref={last} >
          <img src={uni.img} alt="" />
          <div>
            <p>{uni.name}</p> <span></span> <br />
          </div>
        </li>
      )
      else
          return(
            <li key={uni.uid} >
              <img src={uni.img} alt="" />
              <div>
                <p>{uni.name}</p> <span></span> <br />
              </div>
            </li>
          )
           } )}
          {myload && <PlaceHolderLoader />}
        </ul>
      </div>
    </main>
  );
};
export default UniversityAccounts;
