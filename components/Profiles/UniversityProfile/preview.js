import classes from "./UniversityProfile.module.css";
import profilePicture from "../../../Images/profilePicutre.jpg";
import alkawarizmiPicture from "../../../Images/Alkhawarzimi.jpg";
import Uob from "../../../Images/UniversityofBaghdad.png";
import UobBanner from "../../../Images/UoB_Tower.jpg";
import location from "../../../Images/location.png";
import website from "../../../Images/website.png";
import facebook from "../../../Images/facebook.png";
import twitter from "../../../Images/twitter.png";
import instagram from "../../../Images/instagram.png";
import email from "../../../Images/email.png";
import edit from "../../../Images/pencil.png";
import { useState } from "react";
const UniversityProfile=()=>{
    const [activatedList,setActivatedList]=useState("colleges");
    const [activatedSection,setActivatedSection]=useState("overview");
    const isCollegeActivated=activatedList === "colleges";
    const isAboutActivated=activatedList === "about";
    const isOverviewSelected=activatedSection === "overview";
    const isContactSelected=activatedSection=== "contact";
    const colleges=[
        {
            name:"alKhawarizmi College of Engineering",
            uid:"UoBKefc",
            university:"University of Baghdad"
        }
    ]
    return(
        <div className={classes.firstContainer}>
        <div className={classes.container}>
            <div className={classes.upperBanner}>
                <img className={classes.upperBanner} src={UobBanner} alt=""/>
            </div>
            <div className={classes.mainInfo}>
            <img src={Uob} className={classes.profilePicture} alt=""/>
            <div>
            <h2>University of Baghdad</h2>
            <p>@UoB</p></div>
            <button>
                <img src={edit} alt=""/>edit profile
            </button>
            </div>
           
            <div className={classes.info}>
                <ul className={classes.navigators}>
                    <li onClick={()=>setActivatedList('colleges')} className={isCollegeActivated ?  classes.activated:`` }>Colleges</li>
                    <li onClick={()=>setActivatedList('about')} className={isAboutActivated ?  classes.activated:`` }>About</li>
                </ul>
              {  isCollegeActivated && <div className={classes.collegesContainer}>
                    <ul className={classes.colleges}>
                       {colleges.map((college)=>
                        <li key={college.uid}>
                            
                            <img src={alkawarizmiPicture} alt=""/> 
                            <div><p>{college.name}</p> <span>@{college.uid}</span> <br/>
                                 <span>{college.university}</span> 
                            </div>
                        </li>
                       )} 
                    </ul>
                </div>}
                {  isAboutActivated && <div className={classes.aboutContainer}>
                   
                    <ul>
                  
                        <li onClick={()=>setActivatedSection("overview")} className={isOverviewSelected ?  classes.activated:`` }><p>Overview</p></li>
                        <li onClick={()=>setActivatedSection("contact")} className={isContactSelected ?  classes.activated:`` }><p>Contact</p></li>
                    </ul>
                    <div>
                        {isOverviewSelected && 
                        <section className={classes.overview}>
                            <div className={classes.details}>
                                <h3>Details</h3>
                                <p>
                                 University of Baghdad is a public university in Baghdad. It's the largest university in Iraq and the tenth largest university in Arab world.
                                </p>
                            </div>
                            <div className={classes.location}>
                                <img  src={location} alt=""/> <p>Iraq, Baghdad</p> 
                            </div>
                        </section>
                        }
                        {isContactSelected &&
                         <section>
                            <div className={classes.contact}>
                                <h3>Contact</h3>
                                <span><img src={email} alt=""/> <p>example@mail.com</p></span>
                            </div>
                            <div className={classes.socials}>
                                <h3>Website and Social links</h3>
                                <span><img src={website} alt=""/> <a href="www.uob.com">www.uob.com</a></span>
                                <span><img src={instagram} alt=""/> <a href="www.uob.com">UOB</a></span>
                                <span><img src={facebook} alt=""/> <a href="www.uob.com">University of Baghdad</a></span>
                                <span><img src={twitter} alt=""/> <a href="www.uob.com">University of Baghdad</a></span>
                            </div>
                        </section>
                        }
                    </div>
                   </div>
                }

            </div>

        </div>
        </div>
    )
}
export default UniversityProfile;