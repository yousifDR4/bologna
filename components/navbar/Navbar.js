import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";
import menu from "../../Images/menu.png"
import { useState } from "react";
import {  useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from 'react-redux';
import { authActions, onLogin, selectUid, selectuid } from "../../store/auth-slice";
import  question from "../../Images/question.png";
import  login from "../../Images/enter.png";
import  university from "../../Images/university.png";
import idea from "../../Images/idea.png";
import { profileActions } from "../../store/profile-slice";
import { auth, getprofile } from "../../store/fire";
import { onAuthStateChanged } from "firebase/auth";
let reF=true;
const Navbar=()=>{

    const dispatchRedux=useDispatch();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [showAsideList,setShowAsideList]=useState(false);
    const isLoggedIn=useSelector(state=> state.auth.loggedIn);
    const accountType=useSelector(state=> state.auth.accountType);
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
        }
      }
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
               {!isLoggedIn && <li><Link to="/Login">Login</Link></li>}
            </div>
           <div> 
                <li className={classes.line}></li>
                <li><button onClick={showAsideListHandler}><img src={menu} alt="menu icon"/></button></li>
           </div>
        </ul>
        <div className={`${active} ${classes.asideList}`}>
        <ul >
                <li><Link to="/"  onClick={showAsideListHandler}>APS</Link></li>
               {!isLoggedIn && <li><Link to="/Login" onClick={showAsideListHandler}><img src={login} alt="" className={classes.login}/> Login</Link> <div className={classes.innerLine}/></li>}
                <li><Link to="/" onClick={showAsideListHandler}><img src={question} alt=""/> what's APS</Link><div className={classes.innerLine}/></li>
                <li><Link to="/" onClick={showAsideListHandler}><img src={idea} alt=""/> How it works</Link><div className={classes.innerLine}/></li>
                <li><Link to="/Universities" onClick={showAsideListHandler}><img src={university} alt=""/> Colleges using it</Link><div className={classes.innerLine}/></li>
                {isCollegeAccount && <li><Link to="/CollegeProfile">College Profile</Link></li>}
               {isUniversityAccount && <li><Link to="/UniversityProfile">University Profile</Link></li>}
                { isLoggedIn && <li><button onClick={logoutHandler}>Logout</button></li>}
        </ul></div>
    </nav>
</>
);
}
export default Navbar;