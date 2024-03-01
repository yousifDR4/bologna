import { useEffect, useState, useSyncExternalStore } from "react";
import InfoCards from "./InfoCards";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import UpcomingClasses from "./UpcomingClasses";
import { BarChart, BarPlot } from '@mui/x-charts/BarChart';
import { ChartsAxis, ChartsLegend, ChartsText, ChartsTooltip, ChartsXAxis, ChartsYAxis, ResponsiveChartContainer } from "@mui/x-charts";
import { get_Subjects, get_classRooms } from "../../../../store/getandset";
import TodaySchedule from "./TodaySchedule";
import Loader from "../../../UI/Loader/Loader";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import StudentCalendar from "./StudentCalendar";
import Posts from "./Posts";
let initValue=[{title:"The end of Semester",user:"University of Baghdad",describtion:"The Popup is a utility component for creating various kinds of popups. It relies on the third-party Floating UI library for positioning"},{title:"Something to remember",user:"University of Baghdad",describtion:"The Popup is a utility component for creating various kinds of popups. It relies on the third-party Floating UI library for positioning"}]
const Home=()=>{
    let modulesSch=[{
        startingTime:"8:30",
        endingTime:"9:30",
        day:4,
        name:"gfff",
        moduleId:"2xlqUWREDJlWYKvAcIXt",
        classroomId:"Wg02U4gQeL1J4RtNTOOn",
        id:"01",
        type:"Lab",
        study:"evening"
        },
        {
            startingTime:"11:30",
            endingTime:"13:20",
            day:4,
            name:"gf2f",
            moduleId:"8zTysIWH52b5hpdO26ge",
            classroomId:"Wg02U4gQeL1J4RtNTOOn",
            id:"02",
            type:"Lab",
            study:"evening"
    
            },
            {
                startingTime:"10:30",
                endingTime:"11:30",
                day:4,
                name:"gf3f",
                moduleId:"I2qrI4HRfR5Jgvjigcwu",
                classroomId:"Wg02U4gQeL1J4RtNTOOn",
                id:"03",
                type:"Online",
                study:"evening"
    
                },
                {
                    startingTime:"23:40",
                    endingTime:"24:30",
                    day:4,
                    name:"gfiu89iu4f",
                    moduleId:"QHX2CalYd0nQtudw4sul",
                    classroomId:"Wg02U4gQeL1J4RtNTOOn",
                    id:"04",
                    type:"Inside Classroom",
                    study:"evening"
    
                    },
        ]
    const [attendancePercentage,setAttendancePercentage]=useState(0);
    const [lstWeekAttendPer,setLstWeekAttendPer]=useState(0);
    const [assginments,setAssignments]=useState(0);
    const [noModules,setNoModules]=useState(0);
    const [classrooms,setClassrooms]=useState([]);
    const [modules,setModules]=useState([]);
    const [schedule,setSchedule]=useState(modulesSch);
    const [grades,setGrades]=useState([]);
    const today=new Date();
    console.log(today);
    const [quizes,setQuizes]=useState([{date:today,module:"2xlqUWREDJlWYKvAcIXt",title:"quiz1"}]);
    const [midTerms,setMidTerms]=useState([{date:today,module:"2xlqUWREDJlWYKvAcIXt",title:"Physics"}]);
    const [formativeAsses,setFormativeAsses]=useState({modules:["physics","Math","Algorithms"],grades:[{type:"bar",label:"Your grades",data:[10,25,30]},{type:"bar",label:"Average class grade",data:[15,10,12]}]});
    const [notices,setNotices]=useState(initValue);
    const [loading,setLoading]=useState({attendancePercentage:true,lstWeekAttendPer:true,assginments:true,noModules:true,noModules:true,schedule:true,grades:true,midTerms:true,notices:true});
    const [intLoading,setintLoading]=useState(true);
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    useEffect(()=>{
        const fetchData=async()=>{
            //....fetch
            setintLoading(true);
            try{
            const p1 = get_Subjects(Department_id);
            const p3=get_classRooms(Department_id);
            const [Sujects,classRooms]=await Promise.all([p1,p3])
            console.log(Sujects,classRooms);
            setModules(Sujects); 
            setClassrooms(classRooms);
            setintLoading(false);
            }
            catch(e){

            }
        }
        if(profile.Department_id){
        fetchData();
        }
    },[profile]);
    if(intLoading){
        return <Loader/>
    }
    return(
        <Box sx={{width:"100%",display:"grid",justifyItems:"center",boxSizing:"border-box"}}>
            <Box sx={{display:"flex",maxWidth:"100vw",boxSizing:"border-box",flexWrap:"wrap",padding:"0.8rem 0.5rem",columnGap:"2rem",rowGap:"0.8rem"}}>
            <Box sx={{display:"flex",flexWrap:"wrap",width:"100%",maxWidth:1100,height:"fit-content",rowGap:"2rem",columnGap:"1rem"}}>
            <InfoCards attendancePercentage={attendancePercentage} lstWeekAttendPer={lstWeekAttendPer} assginments={assginments} noModules={noModules}/>
            <UpcomingClasses schedule={schedule}/>
            <Box sx={{flex:"1",minWidth:300,boxShadow:"1"}} >
            <ResponsiveChartContainer  height={300} title="some" sx={{bgcolor:"#fff",borderRadius:"0.5rem"}}  xAxis={[{ scaleType: 'band', data:formativeAsses.modules,id:"x-axis-id" }]}
      series={formativeAsses.grades} text tooltip={{ trigger: 'axis' }}  desc="ggg"> 
            <BarPlot/>
            <ChartsText text="Grades" shapeRendering={true}/>
            <ChartsTooltip/>
            <ChartsXAxis label="Modules" position="bottom" axisId="x-axis-id" />
            <ChartsYAxis position="left" label="Grades"/>
            <ChartsLegend />
    </ResponsiveChartContainer>
           </Box>
           <Box sx={{maxWidth:320}}>
           <StudentCalendar quizes={quizes} midTerms={midTerms} assginments={assginments} modules={modules}/>
           </Box>
           <Box sx={{flex:"1"}}>
            <Posts notices={notices}/>
           </Box>
            </Box>
            <Box sx={{overflow:"auto",maxWidthidth:"100%",boxSizing:"border-box"}}> 
            <TodaySchedule modules={schedule} modulesList={modules} classRooms={classrooms} timeStart="8:30" timeEnd="14:30"/>
            </Box>
            </Box>
        </Box>
    );
}
export default Home;