import classes from "./UniversityProfile.module.css";
import AddCollege from "./AddCollege.js";
import defaultProfilePicture from "../../../Images/profilePicutre.jpg";
import alkawarizmiPicture from "../../../Images/Alkhawarzimi.jpg";
import locationIcon from "../../../Images/location.png";
import website from "../../../Images/website.png";
import facebook from "../../../Images/facebook.png";
import twitter from "../../../Images/twitter.png";
import instagram from "../../../Images/instagram.png";
import email from "../../../Images/email.png";
import edit from "../../../Images/pencil.png";
import options from "../../../Images/option.png";
import { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import CustomInput from "./CustomInput";
import { useSelector } from "react-redux";
import AboutComponent from "./AboutComponent";
import { auth, db } from "../../../store/fire";
import {
  collection, 
  query,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import { useFetch } from "../../../hooks/useFetch.jsx";
import { useStudensts } from "../../../hooks/useStudents.jsx";
import Loader from "../../UI/Loader/Loader.js";
import { Box, Button, ListItem, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { get_users } from "../../../store/getandset.js";
import { Link, useLocation,useSearchParams } from "react-router-dom";
const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
const ViewUniversityProfile = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = (queryParams.get('id') || ''); //getting module id from url
    const [profile, setprofile] = useState({});
  const [reload,setReload]=useState(false);
  const [activatedList, setActivatedList] = useState("colleges");
  const [activatedSection, setActivatedSection] = useState("overview");
  const [showEdit, setShowEdit] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showAddCollege,setShowAddCollege]=useState(false);
  const isCollegeActivated = activatedList === "colleges";
  const isAboutActivated = activatedList === "about";
  const isOverviewSelected = activatedSection === "overview";
  const isContactSelected = activatedSection === "contact";
  const {data:colleges,load,error,setData}=useFetch(profile?.Colleges_id?profile.Colleges_id:[],reload);
  const [loading, setloading] = useState(true);
  useEffect(()=>{
    if(!id)return;
    const f=async()=>{
        try{
      const p= await get_users([id]);  
      console.log(p[0]);
      setprofile(p[0]);
      setloading(false);
      setReload(true);
        }
        catch(e){
            console.log(e);
        }
    }
    f();
  },[id]);
  if(loading ){
    return(
      <Loader/>
    )
  }
  else{
  return (
    <>
    {showAddCollege && <div className={`${showAddCollege?classes.active:""} ${classes.addCollege}`}>
    <AddCollege setReload={setReload} showAdd={setShowAddCollege}/>
    </div>}
      <div className={classes.firstContainer}>
        <div className={classes.container}>
          <div className={classes.upperBanner}>
            {profile?.bannerPicture ? (
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
                profile?.profilePicture
                  ? profile.profilePicture.length > 0
                    ? profile.profilePicture
                    : defaultProfilePicture
                  : defaultProfilePicture
              }
              className={classes.profilePicture}
              alt=""
            />
            <div>
              <h2>{profile.name}</h2>
              <p>@{profile.uid}</p>
            </div>
          </div>

          <div className={classes.info}>
            <ul className={classes.navigators}>
              <li
                onClick={() => setActivatedList("colleges")}
                className={isCollegeActivated ? classes.activated : ``}
              >
                Colleges
              </li>
              <li
                onClick={() => setActivatedList("about")}
                className={isAboutActivated ? classes.activated : ``}
              >
                About
              </li>
            </ul>
            {isCollegeActivated && (
              <div className={classes.collegesContainer}>
                <ul className={classes.colleges}>
                <ListItem hidden sx={{display:"none !important"}}></ListItem>
                   {colleges.length <1 ? <Typography textAlign="center" width="100%" color="text.secondary">No Colleges were found!</Typography>:
                 colleges.map((college) => (
                    <li key={college.uid}>
                      <img src={alkawarizmiPicture} alt="" />
                      <div>
                      <Link to={`/ViewCollegeProfile?id=${college.uid}`}> <p>{college.name}</p></Link>  <span>@{college.uid}</span> 
                      </div>
                    </li>
                  ))}
                </ul>
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
                          {(profile?.details  ? true : false) && (
                            <AboutComponent
                              type="details"
                              value={profile.details}
                              icon=""
                            />
                          )}
                        </div>
                      </div>
                      <div className={classes.location}>
                        {(profile?.location  ? true : false) && (
                          <AboutComponent
                            type="location"
                            value={profile.location}
                            icon={locationIcon}
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
                          <img src={email} alt="" /> <p>{validateEmail(profile.email)?profile.email:""}</p>
                        </span>
                      </div>
                      <div className={classes.socials}>
                        <h3>Website and Social links</h3>
                        {(profile?.website  ? true : false) && (
                          <AboutComponent
                            type="website"
                            value={profile.website}
                            icon={website}
                            edit={false}
                          />
                        )}
                        {(profile?.instagram  ? true : false) && (
                          <AboutComponent
                            type="social"
                            value={profile.instagram}
                            icon={instagram}
                            socialType="instagram"
                            edit={false}

                          />
                        )}
                        {(profile?.facebook  ? true : false) && (
                          <AboutComponent
                            type="social"
                            value={profile.facebook}
                            icon={facebook}
                            socialType="facebook"
                            edit={false}

                          />
                        )}
                        {(profile?.twitter ? true : false) && (
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
          </div>
        </div>
      </div>
    </>
  );
};}
export default ViewUniversityProfile;
