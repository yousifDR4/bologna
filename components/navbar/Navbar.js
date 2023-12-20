import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";
import menu from "../../Images/menu.png"
import { useEffect, useState } from "react";
import {  useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from 'react-redux';
import { authActions, onLogin, selectUid, selectuid } from "../../store/auth-slice";
import  question from "../../Images/question.png";
import  login from "../../Images/enter.png";
import  university from "../../Images/university.png";
import idea from "../../Images/idea.png";
import { profileActions } from "../../store/profile-slice";
import { auth, db, getprofile } from "../../store/fire";
import { onAuthStateChanged } from "firebase/auth";
import profilePicture from "../../Images/userprofile.png";
import moduleIcon from "../../Images/bookb.png";
import professor from "../../Images/professor.png"
import collapse from "../../Images/downArrow.png";
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { check, gen } from "../../store/getandset";
let reF=true;
let x=true;
const Navbar=()=>{
  
    const [loading,setLoading]=useState(true);
    const [activatedList,setActivatedList]=useState([]);
    const dispatchRedux=useDispatch();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [showAsideList,setShowAsideList]=useState(false);
    const isLoggedIn=useSelector(state=> state.auth.loggedIn);
    const accountType=useSelector(state=> state.auth.accountType);
    const profile=useSelector(state=>state.profile.profile);
    const Department_id=profile.Department_id;
    const navigate=useNavigate();
    const isUniversityAccount=isLoggedIn ? accountType === 'University': false;
    const isCollegeAccount=isLoggedIn ? accountType === 'College': false;
    const isDepartmentAccount=isLoggedIn ? accountType === 'Department': false;
    const dispatch=useDispatch();
    const showAsideListHandler=()=>{
        setShowAsideList((state)=> !state);
    }
    const active=showAsideList ? classes.active :'';
    const backdrop=showAsideList ? classes.backdrop:'';
    const logoutHandler=async()=>{
        await auth.signOut();
        dispatch(authActions.logOut());
        dispatch(profileActions.logOut());
        setShowAsideList(false);
       navigate('/');
    }
    const uid = useSelector(selectuid);
    onAuthStateChanged(auth,async(user)=>{
        console.log(location.pathname);
      if(user&&reF){
        if((user.uid!==uid && uid===null)&& location.pathname!=="/Login"){
            console.log("inside",location.pathname);
            console.log("onauthstatechange");
      const k=await getprofile()
      dispatchRedux(onLogin(k));
      reF=false;
      setLoading(false)
        }
      }
      else if(reF){
        setLoading(false);
        reF=false;
      }
    },[]);
    const collapseHandler=(s)=>{
        if(!activatedList.includes(s))
        setActivatedList(prev=>{
                    return [...prev,s]});
        else
        setActivatedList(prev=>{
    console.log(prev.filter(l=> (l !== s)));
    return prev.filter(l=> (l !== s))});
    }  
    // useEffect(() => {
    //     if(!Department_id)
    //     return;
    //     if(Department_id.length===0)
    //     return;
    //     // const DepartmentRef=doc(db,"reports",where("Department_id","==",auth.currentUser.uid));
    //     // const q=query(collection(DepartmentRef, "Department"),orderBy("name"))
    //     const q=query(collection(db, "reports"),where("Department_id","==",Department_id))
      //   const unsubscribe = onSnapshot(q, (snapshot) => {
      //     let count = 0;
      //     let x=[]
      //     snapshot.docs.forEach((d)=>{
      //       console.log(d.data());
      //       x.push({...d.data(),id:d.id})
      //     })
      //     snapshot.docChanges().forEach((change) => {
      //       if (change.type === "added"&&
      //       (change.doc.data().seen.filter((id)=>id===Department_id)[0]!==Department_id)&&
      //       change.doc.data().uid!==auth.currentUser.uid
      //       ) 
      //       {
      //         console.log("location",location.pathname);
      //         const temp=doc(db,change.doc.ref.path);
      //        console.log(temp);
             
      //         console.log(change.doc.data());
      //         count++;
      //         console.log("notfacation",count);
      //       }
      //     });
      //   });
      //   return () => unsubscribe;
      // }, [Department_id]);
      useEffect(()=>{
       const f=async()=>{  
       let x= await check("ICE");
       console.log(x);
       console.log(55);
       }
       f();

      },[])
return(
<>
<div className={backdrop} onClick={showAsideListHandler}/>
    <nav className={classes.nav}>
        <ul className={classes.navList}>
            <div>
                <li><Link to="/">APS</Link></li>
            </div>
            <div>
                <li><Link to="/">what's APS</Link></li>
                <li><Link to="/">How it works</Link></li>
                <li><Link to="/Universities">Universities using it</Link></li>
               {isUniversityAccount && <li><Link to="/UniversityProfile">University Profile</Link></li>}
               {isCollegeAccount && <li><Link to="/CollegeProfile">College Profile</Link></li>}
               {isDepartmentAccount && <li><Link to="/DepartmentProfile">Department Profile</Link></li>}
               {!loading && !isLoggedIn && <li><Link to="/Login">Login</Link></li>}
            </div>
           <div> 
                <li className={classes.line}></li>
                <li><button onClick={showAsideListHandler}><img src={menu} alt="menu icon"/></button></li>
           </div>
        </ul>
        <div className={`${active} ${classes.asideList}`}>
        <ul >
                <li><Link to="/"  onClick={showAsideListHandler}>APS</Link></li>
               {!isLoggedIn && <li><Link to="/Login" onClick={showAsideListHandler}><img src={login} alt="" className={classes.login}/>Login</Link> <div className={classes.innerLine}/></li>}
                <li><Link to="/" onClick={showAsideListHandler}><img src={question} alt=""/>what's APS</Link><div className={classes.innerLine}/></li>
                <li><Link to="/" onClick={showAsideListHandler}><img src={idea} alt=""/>How it works</Link><div className={classes.innerLine}/></li>
                <li><Link to="/Universities" onClick={showAsideListHandler}><img src={university} alt=""/>Colleges using it</Link><div className={classes.innerLine}/></li>
                {isCollegeAccount && <li><Link to="/CollegeProfile"><img src={profilePicture} alt=""/>College Profile</Link></li>}
                {isDepartmentAccount && <li><Link to="/DepartmentProfile"><img src={profilePicture} alt=""/>Department Profile</Link></li>}
               {isUniversityAccount && <li><Link to="/UniversityProfile"><img src={profilePicture} alt=""/>University Profile</Link></li>}
               {isDepartmentAccount && <li><Link to="/ProgramManage"><img src={profilePicture} alt=""/>Manage Program</Link></li>}
               {isDepartmentAccount && <li><Link to="/Classrooms"><img src={profilePicture} alt=""/>Classrooms Table</Link></li>}
              { isDepartmentAccount && <div className={classes.container}>
              <li onClick={()=>collapseHandler('m')} className={activatedList.includes('m')? classes.activeList :""}><img src={moduleIcon} alt=""/> Modules  <img src={collapse}/></li>
              { activatedList.includes('m') &&
              <>
               <li><Link to="/AddModule"><img src={profilePicture} alt=""/> Add Module</Link></li>
            <li><Link to="/ModuleTable"><img src={profilePicture} alt=""/> Modules Table</Link></li> 
            </>
            }  </div> 
            }
            { isDepartmentAccount &&  <div className={classes.container}>
               <li onClick={()=>collapseHandler('p')} className={activatedList.includes('p')? classes.activeList :""}><img src={professor} alt=""/> Professors <img src={collapse}/></li>
               { activatedList.includes('p') &&
               <>
               <li><Link to="/AddProfessor"><img src={profilePicture} alt=""/> Add Proffessor</Link></li>
               <li><Link to="/ProfessorList"><img src={profilePicture} alt=""/> Professors Table</Link></li>
               </>}
               </div>}
               {isLoggedIn && <li><Link to="/Notifications" ><img src={profilePicture} alt=""/>Notifications</Link></li>}
                { isLoggedIn && <li><button onClick={logoutHandler}>Logout</button></li>}
        </ul></div>
    </nav>
</>
);
}
export default Navbar;