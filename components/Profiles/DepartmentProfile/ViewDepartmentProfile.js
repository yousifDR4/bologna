import classes from "./DepartmentProfile.module.css";
import AddModule from "./AddModule.js";
import defaultProfilePicture from "../../../Images/profilePicutre.jpg";
import alkawarizmiPicture from "../../../Images/Alkhawarzimi.jpg";
import location from "../../../Images/location.png";
import website from "../../../Images/website.png";
import facebook from "../../../Images/facebook.png";
import twitter from "../../../Images/twitter.png";
import instagram from "../../../Images/instagram.png";
import email from "../../../Images/email.png";
import edit from "../../../Images/pencil.png";
import group from "../../../Images/group.png";
import options from "../../../Images/option.png";
import { useEffect, useState } from "react";
import EditProfile from "../UniversityProfile/EditProfile.js";
import CustomInput from "../UniversityProfile/CustomInput.js";
import { useSelector } from "react-redux";
import AboutComponent from "../UniversityProfile/AboutComponent.js";
import { auth, db } from "../../../store/fire.jsx";

import Loader from "../../UI/Loader/Loader.js";
import {
  collection, 
  query,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  where,
  getCountFromServer,
  and,
} from "firebase/firestore";
import Modules from "./Modules.js";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { Edit, ExpandMore } from "@mui/icons-material";
import AddPost from "./AddPost.js";
import { useQuery } from "react-query";
import { get_posts_promise, get_users } from "../../../store/getandset.js";
import { Link, useLocation,useSearchParams } from "react-router-dom";
const ViewDepartmentProfile = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = (queryParams.get('id') || ''); //getting module id from url
    console.log(id,"gfe");
    const [profile, setprofile] = useState({});
  const Department_id=id;
  const [professors,setProfessors]=useState(0);
  const [students,setStudents]=useState(0);
  const [activatedList, setActivatedList] = useState("modules");
  const [activatedSection, setActivatedSection] = useState("overview");
  const [showEdit, setShowEdit] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const isModulesActivated = activatedList === "modules";
  const isAboutActivated = activatedList === "about";
  const isPostsActivated = activatedList === "posts";
  const isOverviewSelected = activatedSection === "overview";
  const isContactSelected = activatedSection === "contact";
  const [modules, setDepartments] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(()=>{
    if(!id)return;
    const f=async()=>{
        try{
      const p= await get_users([id]);  
      console.log(p[0]);
      setprofile(p[0]);
      const q=query(collection(db,"users"),and (where("role","==","Proffessor"),where(
        "Department_id","==",id
      )));
      const sum=await getCountFromServer(q);
      console.log(sum.data().count);
      setProfessors(sum.data().count);
      setloading(false);
        }
        catch(e){
            console.log(e);
        }
    }
    f();
  },[id]);
  const promise=()=> get_posts_promise(Department_id);
  const {
    data: posts=[],
    isLoading,
    error,
  isFetching, 
  refetch 
  } = useQuery(`department:${Department_id}`, promise, {
   enabled:Department_id !== "",
    refetchOnWindowFocus:false,
  
    select:(data)=>{
        return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
    }
  }
  );
if(loading){
  return(
    <>
    <Loader/>
    </>
  )
}
else{
  return (
<>
   <>
   </>
      <div className={classes.firstContainer}>
        <div className={classes.container}>
          <div className={classes.upperBanner}>
            {profile.bannerPicture ? (
              profile.bannerPicture.length > 0 ? (
                <img
                  className={classes.upperBanner}
                  src={profile.bannerPicture}
                  alt=""
                />
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>
          <div className={classes.mainInfo}>
            <img
              src={
                profile.profilePicture
                  ? profile.profilePicture.length > 0
                    ? profile.profilePicture
                    : defaultProfilePicture
                  : alkawarizmiPicture
              }
              className={classes.profilePicture}
              alt=""
            />
            <div>
              <h2>{profile.name}</h2>
              <p>@{profile.username}</p>
            </div>
            {/* <button onClick={() => setShowEdit((prev) => !prev)}>
              <img src={edit} alt="" />
              edit profile
            </button> */}
          </div>

          <div className={classes.info}>
            <ul className={classes.navigators}>
              <li
                onClick={() => setActivatedList("modules")}
                className={isModulesActivated ? classes.activated : ``}
              >
               General
              </li>
              <li
                onClick={() => setActivatedList("about")}
                className={isAboutActivated ? classes.activated : ``}
              >
                About
              </li>
              <li
                onClick={() => setActivatedList("posts")}
                className={isPostsActivated ? classes.activated : ``}
              >
                Posts
              </li>
            </ul>
            {isModulesActivated && (
              <div className={classes.deptsContainer}>
              <div>
                <h2>Professors</h2>
                <div>
                  <span>
                    <img src={group}/>
                    <p>Total Professors</p>
                    <p>{professors}</p>
                  </span>
                </div>
              </div>
              <div>
              <h2>Students</h2>
                <div>
                  <span>
                    <img src={group}/>
                    <p>Total Students</p>
                    <p>{students}</p>
                  </span>
                </div>
              </div>
              </div>
            )}
            {isAboutActivated && (
              <Box sx={{boxShadow:"1"}} className={classes.aboutContainer}>
                <ul>
                  <li
                    onClick={() => setActivatedSection("overview")}
                    className={isOverviewSelected ? classes.activated : ``}
                  >
                    <p>Overview</p>
                  </li>
                  <li
                    onClick={() => setActivatedSection("contact")}
                    className={isContactSelected ? classes.activated : ``}
                  >
                    <p>Contact</p>
                  </li>
                </ul>
                <div>
                  {isOverviewSelected && (
                    <section className={classes.overview}>
                      <div className={classes.details}>
                        <h3>Details</h3>
                        <div>
                          {(profile?.details > 0 ? true : false) && (
                            <AboutComponent
                              type="details"
                              value={profile.details}
                              icon=""
                            />
                          )}
                        </div>
                      </div>
                      <div className={classes.location}>
                        {(profile?.location > 0 ? true : false) && (
                          <AboutComponent
                            type="location"
                            value={profile.location}
                            icon={location}
                          />
                        )}
                      </div>
                    </section>
                  )}
                  {isContactSelected && (
                    <section>
                      <div className={classes.contact}>
                        <h3>Contact</h3>
                        <span>
                          <img src={email} alt="" /> <p>example@mail.com</p>
                        </span>
                      </div>
                      <div className={classes.socials}>
                        <h3>Website and Social links</h3>
                        {(profile?.website > 0 ? true : false) && (
                          <AboutComponent
                            type="website"
                            value={profile.website}
                            icon={website}
                            edit={false}
                          />
                        )}
                        {(profile?.instagram > 0 ? true : false) && (
                          <AboutComponent
                            type="social"
                            value={profile.instagram}
                            icon={instagram}
                            socialType="instagram"
                            edit={false}

                          />
                        )}
                        {(profile?.facebook > 0 ? true : false) && (
                          <AboutComponent
                            type="social"
                            value={profile.facebook}
                            icon={facebook}
                            socialType="facebook"
                            edit={false}

                          />
                        )}
                        {(profile?.twitter> 0 ? true : false) && (
                          <AboutComponent
                            type="social"
                            value={profile.twitter}
                            icon={twitter}
                            edit={false}
                            socialType="twitter"
                          />
                        )}
                      </div>
                    </section>
                  )}
                </div>
              </Box>
            )}
            {
              isPostsActivated &&
              <>
             <List disablePadding title='Posts' sx={{gap:"0.5rem",paddingTop:"0.9rem",width:"100%",display:"flex",flexDirection:"column",flexWrap:"wrap",alignItems:"center"}}>
        
        {
          posts.length < 1 ?  <Typography variant="h6" sx={{fontFamily:"Graphik",marginTop:"2rem",color:"text.secondary",width:"100%",textAlign:"center"}}>No Posts were Found!</Typography>:
            posts.map((not)=>
                <Accordion key={not.title + not.description} sx={{borderRadius:"0.4rem",boxShadow:"1",minWidth:"340px",bgcolor:"#fff",width:"60%"}}>
                <AccordionSummary
                  expandIcon={<ExpandMore/>}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{paddingLeft:"0"}}
                >
                <ListItem>
                  <ListItemAvatar>
                   <Avatar src={profile.profilePicture} alt="profile picture" sx={{width:"4rem",height:"4rem"}}>
                   </Avatar>
                 </ListItemAvatar>
                 <ListItemText primary={not.title} secondary={not.user} sx={{marginLeft:"0.5rem"}}/>
               </ListItem>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography fontFamily="GraphikLight">
                  {not.description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )
        }
    </List>
              </>
            }
          </div>
        </div>
      </div>
    </>
  );
};};
export default ViewDepartmentProfile;
