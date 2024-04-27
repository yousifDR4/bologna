import { useState, useEffect, useRef } from "react";
import classes from "./Notifications.module.css";
import uob from "../../Images/UniversityofBaghdad.png";
import search from "../../Images/search.png";
import { db, auth } from "../../store/fire";
import { getDocs, where, collection, query, doc, onSnapshot, updateDoc, arrayUnion, and } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../UI/Loader/Loader";
import { usePaginationFetch } from "../../hooks/usePaginationFetch";
import Myloader from "../UI/Loader/Myloader";
import PlaceHolderLoader from "../UI/Loader/PlaceHolderLoader";
import { useLocation } from "react-router-dom";
import addIcon from "../../Images/addColored.png";
import addUser from "../../Images/addU.png"
import { notifyActions } from "../../store/notify-slice";
const universities = [];
const Notifications = () => {

  const dispatchRedux = useDispatch();
  dispatchRedux(notifyActions.setNotificationsNumber({no:0}))
  const setRef = useRef(true);
  const [university, setUniversity] = useState(universities);
  const notifitcations=useSelector(state=>state.notify.notifications);
  const [loading,setLoading]=useState(true);
  console.log(notifitcations);
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
  if(!Department_id)return;
const k= await getDocs( query(
  
    collection(db, "reports"),
    and(
      where("Department_id", "==", Department_id),
      where("studentId", "==", auth.currentUser.uid)
    )
  ));
  console.log(k.docs[0].data());


}
f();
  },[Department_id])
  useEffect(() => {
    if(notifitcations.length === 0) {
      setLoading(false);
      return;}
    const f = async () => {
      setLoading(true);
      try{
     notifitcations.forEach(async element => {
      if(element.seen.includes(auth.currentUser.uid))return;
      console.log("seen");
        await updateDoc(doc(db,"reports",element.id),{
          seen:arrayUnion(auth.currentUser.uid)
        });
      });
     

    }
       catch (e) {
        console.log(e);
        setLoading(false);
      }
      finally{
        setLoading(false);
      }
    };
    f();
  }, [notifitcations]);
    if(loading){
      console.log(loading);
      return(
      <Loader/>
      )
    }
   else if(notifitcations===  "empty"){
    console.log(loading,notifitcations);
    return (
      <main className={classes.main}>
      <h2>No notifications were found!</h2>
      </main>
    )
  }
    else {return (
      <main className={classes.main}>
        <div className={classes.universities}>
          <ul>
            {notifitcations.map((not) => (
              <li key={not.id}>
                <img src={not.type==="add" ? not.describtion ==="add a module" ? addIcon:addUser:addUser } alt="" />
                <div>
                  <p>{not.type==="add" ? not.describtion ==="add a module" ? "A new module was added":"A new account was created":"A new account was created"} by {not.uid}</p> <span></span> <br />
                </div>
              </li>
            ))}
            {loading && <PlaceHolderLoader />}
          </ul>
        </div>
      </main>
    );
};}
export default Notifications;
