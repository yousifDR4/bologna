import { useState, useEffect, useRef } from "react";
import classes from "./Notifications.module.css";
import uob from "../../Images/UniversityofBaghdad.png";
import search from "../../Images/search.png";
import { db, auth } from "../../store/fire";
import { getDocs, where, collection, query, doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { useSelector } from "react-redux";
import Loader from "../UI/Loader/Loader";
import { usePaginationFetch } from "../../hooks/usePaginationFetch";
import Myloader from "../UI/Loader/Myloader";
import PlaceHolderLoader from "../UI/Loader/PlaceHolderLoader";
import { useLocation } from "react-router-dom";
const universities = [];
const Notifications = () => {
  const setRef = useRef(true);
  const [university, setUniversity] = useState(universities);
  const [initalUniversityValue, setInitialUniversityValue] =
    useState(universities);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
  const accountType = useSelector((state) => state.auth.accountType);
  const profile = useSelector((state) => state.profile.profile);
  const [nextdoc, setnextdoc] = useState(null);
  const fetchRef = useRef(true);
  const [myload,setmyload]=useState(false);
  const Department_id=profile.Department_id;
  const [seen,setSeen]=useState("");
  useEffect(()=>{
const f=async ()=>{
  const q=query(collection(db,"reports"),where("Department_id","==",Department_id))
  const docs=await getDocs(q);
  const data=docs.docs.map((e)=>({...e.data(),id:e.id}));
  return data;
}
  },[])
  useEffect(() => {
    if(!Department_id)
    return;
    if(Department_id.length===0)
    return;
    const DepartmentRef=doc(db,"notififcation",Department_id);
    const q=query(collection(DepartmentRef, "Department"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let count = 0;
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added"&&
        change.doc.data().seen.filter((id)=>id===Department_id)[0]!==Department_id
        ) 
        {
          console.log();
          const temp=doc(db,change.doc.ref.path);
         setSeen(temp);
         console.log(temp);
         
          console.log(change.doc.data());
          count++;
          console.log("notfacation",count);
        }
      });
    });
    return () => unsubscribe;
  }, [Department_id]);
  
  useEffect(() => {
    const f = async () => {
      if(seen==="")return;
      console.log("seen");
      try {
        updateDoc(seen,{
          seen:arrayUnion(Department_id)
        })
        }
       catch (e) {
        console.log(e);
      }
    };
    f();
  }, [seen]);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchValue(searchValue), 1000);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    performSearch(debouncedSearchValue);
  }, [debouncedSearchValue]);
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
        console.log(university);
      }
    } else {
      setUniversity(initalUniversityValue);
    }
  };
  const searchChangeHandler = (e) => {
    setSearchValue(e.target.value);
  };
    return (
      <main className={classes.main}>
        <div className={classes.universities}>
          <ul>
            {university.map((university) => (
              <li key={university.uid}>
                <img src={uob} alt="" />
                <div>
                  <p>{university.name}</p> <span></span> <br />
                </div>
              </li>
            ))}
            {myload && <PlaceHolderLoader />}
          </ul>
        </div>
      </main>
    );
};
export default Notifications;
