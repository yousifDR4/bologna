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
const DepartmentProfile = () => {
  const profile = useSelector((state) => state.profile.profile);
  const Department_id=profile.Department_id;
  const [professors,setProfessors]=useState(0);
  const [students,setStudents]=useState(0);
  const loaded = useSelector((state) => state.profile.loaded);
  const [activatedList, setActivatedList] = useState("modules");
  const [activatedSection, setActivatedSection] = useState("overview");
  const [showEdit, setShowEdit] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showAddModule,setShowAddModule]=useState(false);
  const isModulesActivated = activatedList === "modules";
  const isAboutActivated = activatedList === "about";
  const isOverviewSelected = activatedSection === "overview";
  const isContactSelected = activatedSection === "contact";
  const [modules, setDepartments] = useState([]);
  console.log(profile); 
  useEffect(()=>{
    if(!Department_id)return;
    const f=async()=>{
      const q=query(collection(db,"users"),and (where("role","==","Proffessor"),where(
        "Department_id","==",Department_id
      )));
      const sum=await getCountFromServer(q);
      console.log(sum.data().count);
      setProfessors(sum.data().count)
    }
    f();
  },[Department_id])
if(!loaded){
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
      {showEdit && (
        <div className={classes.editProfile}>
          <EditProfile
            showEdit={setShowEdit}
            profilePicture={
              profile.profilePicture ? profile.profilePicture : ""
            }
            bannerPicture={profile.bannerPicture ? profile.bannerPicture : ""}
          />
        </div>
      )}
      {showEdit && (
        <div
          className={classes.backDrop}
          onClick={() => setShowEdit(false)}
        ></div>
      )}
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
            <button onClick={() => setShowEdit((prev) => !prev)}>
              <img src={edit} alt="" />
              edit profile
            </button>
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
              <div className={classes.aboutContainer}>
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
                          {profile.details.length === 0 && (
                            <CustomInput type="details" />
                          )}
                          {(profile.details.length > 0 ? true : false) && (
                            <AboutComponent
                              type="details"
                              value={profile.details}
                              icon=""
                            />
                          )}
                        </div>
                      </div>
                      <div className={classes.location}>
                        {profile.location.length === 0 && (
                          <CustomInput type="location" />
                        )}
                        {(profile.location.length > 0 ? true : false) && (
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
                        {profile.website.length === 0 && (
                          <CustomInput type="website" />
                        )}
                        {(profile.website.length > 0 ? true : false) && (
                          <AboutComponent
                            type="website"
                            value={profile.website}
                            icon={website}
                          />
                        )}
                        {(profile.instagram.length > 0 ? true : false) && (
                          <AboutComponent
                            type="social"
                            value={profile.instagram}
                            icon={instagram}
                            socialType="instagram"
                          />
                        )}
                        {(profile.facebook.length > 0 ? true : false) && (
                          <AboutComponent
                            type="social"
                            value={profile.facebook}
                            icon={facebook}
                            socialType="facebook"
                          />
                        )}
                        {(profile.twitter.length > 0 ? true : false) && (
                          <AboutComponent
                            type="social"
                            value={profile.twitter}
                            icon={twitter}
                            socialType="twitter"
                          />
                        )}
                        {(profile.facebook.length === 0 ||
                          profile.instagram.length === 0 ||
                          profile.twitter.length === 0) && (
                          <CustomInput type="social" />
                        )}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            )}

            {
              isPostsActivated &&
              <>
              <AddPost open={showAddPost} setOpen={setShowAddPost} refetch={refetch}/>
             <List disablePadding title='Posts' sx={{gap:"0.5rem",paddingTop:"0.9rem",width:"100%",display:"flex",flexDirection:"column",flexWrap:"wrap",alignItems:"center"}}>
              <ListItem sx={{borderRadius:"0.4rem",minWidth:"340px",boxShadow:"1",bgcolor:"#fff",width:"60%"}}>
              <ListItemAvatar>
                   <Avatar src={profile.profilePicture} alt="profile picture" sx={{width:"4rem",height:"4rem"}}>
                   </Avatar>
                 </ListItemAvatar>
                 <ListItemText primary={<Typography onClick={()=>setShowAddPost(true)} sx={{transition:"all 0.15s ease-in",color:"text.secondary",cursor:"pointer",width:"100%",borderRadius:"2rem",padding:"0.6rem 0.6rem",bgcolor:"rgb(240, 242, 245)",":hover":{
                  bgcolor:"#EEF0F0"
                 }}}>Share something...</Typography>}  sx={{marginLeft:"0.5rem"}}/>
              </ListItem>
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
export default DepartmentProfile;
