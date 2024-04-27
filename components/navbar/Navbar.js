import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";
import menu from "../../Images/menu.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import {
  authActions,
  onLogin,
  selectUid,
  selectuid,
} from "../../store/auth-slice";
import question from "../../Images/question.png";
import login from "../../Images/enter.png";
import university from "../../Images/university.png";
import idea from "../../Images/idea.png";
import { profileActions } from "../../store/profile-slice";
import { auth, db, getprofile, listnerq } from "../../store/fire";
import { onAuthStateChanged } from "firebase/auth";
import profilePicture from "../../Images/userprofile.png";
import moduleIcon from "../../Images/bookb.png";
import professor from "../../Images/professor.png";
import collapse from "../../Images/downArrow.png";
import addUser from "../../Images/addUser.png";
import table from "../../Images/table.png";
import addModule from "../../Images/addModule.png";
import bell from "../../Images/bell.png";
import manage from "../../Images/manage.png";
import program from "../../Images/program.png";
import classroom from "../../Images/classroom.png";
import GroupIcon from '@mui/icons-material/Group';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { check, gen } from "../../store/getandset";
import { notifyActions } from "../../store/notify-slice";
import { AccountCircleOutlined, AppRegistration, ArticleOutlined, CollectionsBookmarkOutlined, FeaturedPlayListOutlined, GradingOutlined, GroupOutlined, GroupWork, Groups3Outlined, Home, HomeOutlined, Person, PersonOutlined, Schedule } from "@mui/icons-material";
import { errorActions } from "../../store/error-slice";
let reF = true;
let x = true;
let count = 0;
const Navbar = () => {
  const [notifications, setNotifications] = useState(count);
  const noNotification=useSelector((state)=>state.notify.noNotification);
  const [loading, setLoading] = useState(true);
  const [activatedList, setActivatedList] = useState([]);
  const dispatchRedux = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [showAsideList, setShowAsideList] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.loggedIn);
  const accountType = useSelector((state) => state.auth.accountType);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const navigate = useNavigate();
  const isUniversityAccount = isLoggedIn ? accountType === "University" : false;
  const isCollegeAccount = isLoggedIn ? accountType === "College" : false;
  const isDepartmentAccount = isLoggedIn ? accountType === "Department" : false;
  const isProfessorAccount = isLoggedIn ? accountType === "Professor" : false;
  const isStudentAccount = isLoggedIn ? accountType === "student" : false;

  const dispatch = useDispatch();
  const showAsideListHandler = () => {
    setShowAsideList((state) => !state);
  };
  const active = showAsideList ? classes.active : "";
  const backdrop = showAsideList ? classes.backdrop : "";
  const logoutHandler = async () => {
    await auth.signOut();
    navigate("/");
    dispatch(authActions.logOut());
    dispatch(profileActions.logOut());
    setShowAsideList(false);
  };
  const uid = useSelector(selectuid);
  onAuthStateChanged(
    auth,
    async (user) => {
      try{
      console.log(location.pathname);
      if (user && reF) {
        if (
          user.uid !== uid &&
          uid === null &&
          location.pathname !== "/Login"
        ) {
          try{
          console.log("inside", location.pathname);
          console.log("onauthstatechange");
          const k = await getprofile();
          dispatchRedux(onLogin(k));
          reF = false;
          setLoading(false);
          }
          catch(e){
            console.log(e);
          }
                   
        }
      } else if (reF) {
        setLoading(false);
        reF = false;
      }
    }
    catch(e){
      
      dispatchRedux(
        errorActions.setError({
          title: "Connection Faild",
          message: "plese try agin!",
        })
      );
    }
    },
    []
  );
  const collapseHandler = (s) => {
    if (!activatedList.includes(s))
      setActivatedList((prev) => {
        return [...prev, s];
      });
    else
      setActivatedList((prev) => {
        console.log(prev.filter((l) => l !== s));
        return prev.filter((l) => l !== s);
      });
  };
  const clearNotif=()=>{
    setNotifications(0);
  }
  useEffect(() => {
    if (!profile.name) return;
    if (!accountType) return;
    if(isProfessorAccount) return;
    // const DepartmentRef=doc(db,"reports",where("Department_id","==",auth.currentUser.uid));
    // const q=query(collection(DepartmentRef, "Department"),orderBy("name"))
    const q = listnerq(accountType, profile.Department_id);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let x = [];
      snapshot.docs.forEach((d) => {
        console.log(d.data());
        if (d.data()) {
          x.push({ ...d.data(), id: d.id });
        }
      });
      dispatchRedux(notifyActions.setNotify(x));
      if (snapshot.docs.length === 0) {
        dispatchRedux(notifyActions.setNotify("empty"));
      }
      snapshot.docChanges().forEach((change) => {
        if (
          change.type === "added" &&
          !change.doc.data().seen.includes(auth.currentUser.uid) &&
          change.doc.data().uid !== auth.currentUser.uid
        ) {
          console.log(change.doc.data().seen);
          console.log(notifications);
          dispatchRedux(notifyActions.setNotificationsNumber({no:noNotification+1}))
          setNotifications((prev) => {
            return prev + 1;
          });
          console.log("notfacation", notifications);
          console.log("lol");
          count =notifications;
        }
      });


    });
    return () => unsubscribe;
  }, [Department_id]);
  useEffect(()=>{
    count =notifications;
    console.log("useeff",count);
    },[notifications])
  useEffect(()=>{
    count =notifications;
    console.log("useeff",count);
    },[notifications])
    let profileLink=isUniversityAccount?"/UniversityProfile":isCollegeAccount?"/CollegeProfile":isDepartmentAccount?"/DepartmentProfile":isProfessorAccount?"/ProfessorProfile":"/StudentProfile";
  return (
    <>
      <div className={backdrop} onClick={showAsideListHandler} />
      <nav className={classes.nav}>
        <ul className={classes.navList}>
          <div>
          
            <li>
              <Link to="/">APS</Link>
            </li>
          </div>
          <div>
          {!isLoggedIn && (
            <li>
              <Link to="/">what's APS</Link>
            </li>
             )}
              { (isProfessorAccount||isStudentAccount) && (
            <li>
              <Link to={isProfessorAccount?"/ProfessorHome":"/Home"}>Home</Link>
            </li>
             )}
              {isLoggedIn && (
            <li>
              <Link to={profileLink}>Profile</Link>
            </li>
             )}
    
                 {!isLoggedIn && (
            <li>
             
              <Link to="/">How it works</Link>
            </li>
                 )}
            <li>
              <Link to="/Universities">Universities using it</Link>
            </li>
            {isUniversityAccount && (
              <li>
                <Link to="/UniversityProfile">University Profile</Link>
              </li>
            )}

            {isCollegeAccount && (
              <li>
                <Link to="/CollegeProfile">College Profile</Link>
              </li>
            )}
            {isDepartmentAccount && (
              <li>
                <Link to="/DepartmentProfile">Department Profile</Link>
              </li>
            )}
            {!loading && !isLoggedIn && (
              <li>
                <Link to="/Login">Login</Link>
              </li>
            )}
          </div>
          <div>
            <li className={classes.line}></li>
            <li>
              <button onClick={showAsideListHandler}>
                <img src={menu} alt="menu icon" />
              </button>
            </li>
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
                {isStudentAccount && <li><Link to="/Home"><HomeOutlined sx={{verticalAlign:"bottom",padding:"0 !important",margin:"0 !important"}}/> Home</Link></li>}
                {isStudentAccount && <li><Link to="/StudentProfile"><AccountCircleOutlined sx={{verticalAlign:"bottom",padding:"0 !important",margin:"0 !important"}}/> Profile</Link></li>}
                {isStudentAccount && <li><Link to="/StudentModules"><img src={moduleIcon} alt=""/> Modules</Link></li>}
                {isStudentAccount && <li><Link to="/ModuleRegistartion"><CollectionsBookmarkOutlined sx={{verticalAlign:"bottom",padding:"0 !important",margin:"0 !important"}}/> Modules Registartion</Link></li>}
                {isStudentAccount && <li><Link to="/StudentPresence"><PersonOutlined sx={{verticalAlign:"bottom",padding:"0 !important",margin:"0 !important"}}/> Attendance</Link></li>}
                {isProfessorAccount && <li><Link to="/Assesments"><GradingOutlined sx={{verticalAlign:"bottom",padding:"0 !important",margin:"0 !important"}}/> Assesments</Link></li>}
                {isProfessorAccount && <li><Link to="/ProfessorModules"><CollectionsBookmarkOutlined sx={{verticalAlign:"bottom",padding:"0 !important",margin:"0 !important"}}/> Modules</Link></li>}
                {isProfessorAccount && <li><Link to="/StudentsAttendance"><GroupOutlined sx={{verticalAlign:"bottom",padding:"0 !important",margin:"0 !important"}}/> Students Attendance</Link></li>}
                {isProfessorAccount && <li><Link to="/ProfessorHome"><Home sx={{verticalAlign:"bottom",padding:"0 !important",margin:"0 !important"}}/> Home</Link></li>}
               {isUniversityAccount && <li><Link to="/UniversityProfile"><img src={profilePicture} alt=""/>University Profile</Link></li>}
               {isDepartmentAccount && <li><Link to="/Classrooms"><img src={classroom} alt=""/>Classrooms Table</Link></li>}
               {isDepartmentAccount && <li><Link to="/Schedule"><Schedule sx={{verticalAlign:"bottom",padding:"0 !important",margin:"0 !important"}}/> Schedule</Link></li>}
               {isDepartmentAccount && <li><Link to="/Division"><Groups3Outlined sx={{verticalAlign:"bottom",padding:"0 !important",margin:"0 !important"}}/> Divisions</Link></li>}
               { isDepartmentAccount && <div className={classes.container}>
              <li onClick={()=>collapseHandler('pr')} className={activatedList.includes('pr')? classes.activeList :""}><img src={program} alt=""/> Program  <img src={collapse}/></li>
              { activatedList.includes('pr') &&
              <>
               <li><Link to="/ProgramModules"><img src={moduleIcon} alt=""/> Program Modules</Link></li>
            <li><Link to="/AddProgramModule"><img src={addModule} alt=""/> Add Module</Link> </li> 
           <li><Link to="/StudentsModuleRegisteration"><AppRegistration sx={{verticalAlign:"bottom",padding:"0 !important",margin:"0 !important"}}/> Student Registartion</Link></li>
            {isDepartmentAccount && <li><Link to="/ProgramManage"><img src={manage} alt=""/> Manage Program</Link></li>}

            </>
            }  </div> 
            }
              { isDepartmentAccount && <div className={classes.container}>
              <li onClick={()=>collapseHandler('m')} className={activatedList.includes('m')? classes.activeList :""}><img src={moduleIcon} alt=""/> Modules  <img src={collapse}/></li>
              { activatedList.includes('m') &&
              <>
               <li><Link to="/AddModule"><img src={addModule} alt=""/> Add Module</Link></li>
            <li><Link to="/ModuleTable"><img src={table} alt=""/> Modules Table</Link></li> 
            </>
            }  </div> 
            }
            { isDepartmentAccount &&  <div className={classes.container}>
               <li onClick={()=>collapseHandler('p')} className={activatedList.includes('p')? classes.activeList :""}><img src={professor} alt=""/> Professors <img src={collapse}/></li>
               { activatedList.includes('p') &&
               <>
               <li><Link to="/AddProfessor"><img src={addUser} alt=""/> Add Proffessor</Link></li>
               <li><Link to="/ProfessorList"><img src={table} alt=""/> Professors Table</Link></li>
               </>}
               </div>}
               { isDepartmentAccount &&  <div className={classes.container}>
               <li onClick={()=>collapseHandler('e')} className={activatedList.includes('e')? classes.activeList :""}><FeaturedPlayListOutlined sx={{verticalAlign:"middle",padding:"0 !important",margin:"0 !important"}}/> Exams <img src={collapse}/></li>
               { activatedList.includes('e') &&
               <>
             <li><Link to="/ExamCommite"><GroupOutlined sx={{verticalAlign:"middle",padding:"0 !important",margin:"0 !important"}}/> Exam Commite</Link></li>
             <li><Link to="/Exams"><ArticleOutlined sx={{verticalAlign:"middle",padding:"0 !important",margin:"0 !important"}}/> Exams</Link></li>
             <li><Link to="/Grades"><GradingOutlined sx={{verticalAlign:"middle",padding:"0 !important",margin:"0 !important"}}/> Grades</Link></li>
               </>}
               </div>}
               {isLoggedIn  && <li><Link to="/Notifications" ><img src={bell} alt=""/>Notifications{<span className={classes.notifications}>{notifications >0 ? notifications:"" }</span>}</Link></li>}
                { isLoggedIn && <li><button onClick={logoutHandler}>Logout</button></li>}
        </ul></div>
    </nav>
</>
);
}
export default Navbar;