import { useCallback, useEffect, useRef } from "react";
import classes from "./MainPage.module.css";
import { ReactComponent as Arrow } from "./reshot-icon-right-arrow-UCA8NGYZDJ.svg";
import x from "./x.png";
import { useState } from "react";
import { Facebook, Instagram, X } from "@mui/icons-material";
import video from "../../Images/video.mp4";
const MainPage = () => {
  const observer=useRef();
  const [visable,setVisable]=useState(false)
  const features = useCallback( (element)=>{
    if(observer.current)
    observer.current.disconnect();
    observer.current=new IntersectionObserver(entry=>{
      if (entry[0].isIntersecting) {
       setVisable(true);
     
      }
      else{
        console.log("not visable");
    setVisable(false);
      }
    })
   if(element)
    observer.current.observe(element);
    console.log(element);
  },)

  return (
    <>
      <div className={`${classes.headline} `} >
        <div className={classes.grid}>
          <div className={`${classes.title} ${visable?classes.disaper:""}`}>
            <h3>
              Transform Your Education Management with Academic Path System’s
              Digital Solutions.
            </h3>
            <button>
              <p>START NOW</p> <Arrow />
            </button>
          </div>
          <div  className={`${classes.video} ${visable?classes.disaper:""}`}>
            <video loop muted autoPlay  src={video}  type="video/mp4">
            </video>
          </div>
        </div>
        <div className={`${classes.features} ${visable?classes.visable:""}`} ref={features}>
          <span>
            <h3>Comprehensive Profile Management</h3>
            <p>
              allows users (universities, colleges, departments, and students)
              to create and manage their own profiles. For universities and
              colleges, profiles can showcase their history, achievements, and
              offered programs. Departments can detail their courses, faculty,
              and research projects. Student profiles can include academic
              records, extracurricular activities, and personal portfolios. Each
              profile type would have customizable fields relevant to the user's
              role and needs.
            </p>
          </span>
          <span>
            <h3> Integrated Academic Module System</h3>
            <p>
              enables departments to create, manage, and display academic
              modules (courses) with details like syllabi, schedules, faculty
              information, and enrollment options. It facilitates student
              enrollment in these modules, tracking their progress and grades.
              The system can also provide analytics on module popularity,
              student performance, and feedback, aiding in curriculum
              development and resource allocation.
            </p>
          </span>

          <span>
            <h3>Module Management System</h3>
            <p>
              enables departments to create, update, and manage academic
              modules. It includes functionalities such as setting module
              descriptions, prerequisites, credits, and schedules. Departments
              can assign instructors to each module, track enrollment numbers,
              and update module content as necessary. This system could also
              integrate with existing academic calendars and scheduling tools to
              ensure seamless operation.
            </p>
          </span>
          <span>
         <h3> Student Management Portal</h3>
            <p>
              This part of the website allows
              departments to oversee student profiles, including enrollment in
              modules, academic progress, and performance tracking. Departments
              can add or update student information, monitor academic standing,
              and facilitate academic advising. The portal can also include
              features for managing student grades, attendance records, and
              participation in department-related activities.
            </p>
          </span>
        </div>
        <div className={classes.footer}>
          <div className={classes.flexcont}>
          <div className={classes.flex}>
            
            <ul>
              <li>
                <h3>aps</h3>
              </li>
              <li>product</li>
              <li>Features</li>
              <li>about us</li>
              <li>contact us</li>
              <li>product</li>
            </ul>       
          </div>
          </div>
          <hr className={classes.hr} />
          <div className={classes.flexcont}>
          <div className={classes.flex}>
            
            <ul>
              
              <li><Facebook /></li>
              <li><X/></li>
              <li><Instagram/></li>
            </ul>       
          </div>
          </div>
          </div>
       
       
      </div>
    </>
  );
};
export default MainPage;
