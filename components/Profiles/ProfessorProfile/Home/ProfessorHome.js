import { useEffect, useState, useSyncExternalStore } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { BarChart, BarPlot } from '@mui/x-charts/BarChart';
import { ChartsAxis, ChartsLegend, ChartsText, ChartsTooltip, ChartsXAxis, ChartsYAxis, ResponsiveChartContainer } from "@mui/x-charts";
import { get_All_professor_assesments, get_Subjects, get_classRooms, get_posts, get_posts_promise, get_professor_assesments, get_professor_modules } from "../../../../store/getandset";
import Loader from "../../../UI/Loader/Loader";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import InfoCards from "../../StudentProfile/Home/InfoCards";
import StudentCalendar from "../../StudentProfile/Home/StudentCalendar";
import TodaySchedule from "../../StudentProfile/Home/TodaySchedule";
import UpcomingClasses from "../../StudentProfile/Home/UpcomingClasses";
import Posts from "../../StudentProfile/Home/Posts";
import { auth } from "../../../../store/fire";
let initValue=[{title:"The end of Semester",user:"University of Baghdad",describtion:"The Popup is a utility component for creating various kinds of popups. It relies on the third-party Floating UI library for positioning"},{title:"Something to remember",user:"University of Baghdad",describtion:"The Popup is a utility component for creating various kinds of popups. It relies on the third-party Floating UI library for positioning"}]
const ProfessorHome=()=>{
    const [attendancePercentage,setAttendancePercentage]=useState(0);
    const [lstWeekAttendPer,setLstWeekAttendPer]=useState(0);
    const [assginments,setAssignments]=useState(0);
    const [noModules,setNoModules]=useState(0);
    const [noStudents,setNoStudents]=useState(0);
    const [classrooms,setClassrooms]=useState([]);
    const [modules,setModules]=useState([]);
    const [schedule,setSchedule]=useState([]);
    const today=new Date();
    const [assements, setassements] = useState([]);
    const [notices,setNotices]=useState(initValue);
    const [loading,setLoading]=useState({attendancePercentage:true,lstWeekAttendPer:true,assginments:true,noModules:true,noModules:true,schedule:true,grades:true,midTerms:true,notices:true});
    const [intLoading,setintLoading]=useState(true);
    const [professorModules, setprofessorModules] = useState([]);
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.only('xl'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    useEffect(()=>{
        const fetchData=async()=>{
            //....fetch
            setintLoading(true);
            try{
            const p1 = get_Subjects(Department_id);
            const p3=get_classRooms(Department_id);
            const p4=get_professor_modules(Department_id,auth.currentUser.uid);
            const [Sujects,classRooms,pfm]=await Promise.all([p1,p3,p4])
            console.log(Sujects,classRooms);
            setModules(Sujects); 
            setprofessorModules(pfm);
            setClassrooms(classRooms);
            setintLoading(false);
            }
            catch(e){

            }
        }
        const fetchPosts=async()=>{
            const posts=await get_posts([Department_id,profile.College_id]);
            setNotices(posts);
        }
        const fetchAssesments= async()=>{
            const asses=await get_All_professor_assesments(auth.currentUser.uid);
            console.log(asses);
            setassements(asses);
        }
        if(profile.Department_id){
        fetchData();
        fetchPosts();
        fetchAssesments();
        }
    },[profile]);
    if(intLoading){
        return <Loader/>
    }
    return(
        <Box sx={{width:"100%",display:"grid",justifyItems:"center",boxSizing:"border-box"}}>
            <Box sx={{display:"flex",maxWidth:"100vw",boxSizing:"border-box",justifyContent:"center",flexWrap:"wrap",padding:"0.8rem 0.5rem",columnGap:"2rem",rowGap:"0.8rem"}}>
            <Box sx={{display:"flex",flexWrap:"wrap",width:"100%",maxWidth:1100,height:"fit-content",rowGap:"2rem",columnGap:"1rem"}}>
            <InfoCards attendancePercentage={attendancePercentage} lstWeekAttendPer={lstWeekAttendPer} assginments={assginments} noModules={noModules}/>
            <UpcomingClasses schedule={schedule}/>
           <Box sx={{maxWidth: 350,}}>
           <StudentCalendar assesments={assements} professorModules={professorModules}  modules={modules}/>
           </Box>
           <Box sx={{flex:"1"}}>
            <Posts notices={notices}/>
           </Box>
            </Box>
            <Box sx={{overflow:"auto",width:isLargeScreen?"fit-content":"100%",display:"flex",flexDirection:"column",maxWidth:isLargeScreen?"100%":1100,boxSizing:"border-box"}}> 
            <TodaySchedule modules={schedule} modulesList={modules} classRooms={classrooms} timeStart="8:30" timeEnd="14:30"/>
            </Box>
            </Box>
        </Box>
    );
}
export default ProfessorHome;