import { useEffect, useState, useSyncExternalStore } from "react";
import InfoCards from "./InfoCards";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import UpcomingClasses from "./UpcomingClasses";
import { BarChart, BarPlot } from '@mui/x-charts/BarChart';
import { ChartsAxis, ChartsLegend, ChartsText, ChartsTooltip, ChartsXAxis, ChartsYAxis, ResponsiveChartContainer } from "@mui/x-charts";
import { get_Schedule_Adv, get_Subjects, get_all_student_assesments, get_classRooms, get_posts, get_student_active_modules, get_student_schedule_Adv, get_students_grade, get_students_grade_by_modules, get_users } from "../../../../store/getandset";
import TodaySchedule from "./TodaySchedule";
import Loader from "../../../UI/Loader/Loader";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import StudentCalendar from "./StudentCalendar";
import Posts from "./Posts";
import { auth } from "../../../../store/fire";
import { Subject } from "@mui/icons-material";
let initValue=[{title:"The end of Semester",user:"University of Baghdad",describtion:"The Popup is a utility component for creating various kinds of popups. It relies on the third-party Floating UI library for positioning"},{title:"Something to remember",user:"University of Baghdad",describtion:"The Popup is a utility component for creating various kinds of popups. It relies on the third-party Floating UI library for positioning"}]
let initialState={modules:[],grades:[{},{}]}
function findElementByID(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i][0],id);
      if (arr[i][0] === id) { // Check if ID matches the first element of the sub-array
        return arr[i]; // Return the sub-array if found
      }
    }
    return null; // Return null if element with the specified ID is not found
  }

  
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
    const [classrooms,setClassrooms]=useState([]);
    const [modules,setModules]=useState([]);
    const [users, setusers] = useState([]);
    const [studentModule, setstudentModule] = useState([]);
    const [schedule,setSchedule]=useState(modulesSch);
    const [grades,setGrades]=useState([]);
    const today=new Date();
    const [assements, setassements] = useState([]);
    const [quizes,setQuizes]=useState([{date:today,module:"2xlqUWREDJlWYKvAcIXt",title:"quiz1"}]);
    const [midTerms,setMidTerms]=useState([{date:today,module:"2xlqUWREDJlWYKvAcIXt",title:"Physics"}]);
    const [formativeAsses,setFormativeAsses]=useState(initialState);
    const [notices,setNotices]=useState(initValue);
    const [loading,setLoading]=useState({noModules:true,schedule:true,assesments:true,notices:true,bars:true});
    const [intLoading,setintLoading]=useState(false);
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.only('xl'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    useEffect(()=>{
        const fetchData=async()=>{
            //....fetch
            // setintLoading(true);
            try{
            const p1 = get_Subjects(Department_id);
            const p3=get_classRooms(Department_id);
            const p4=get_student_active_modules(profile.registerdModules);
            const [Sujects,classRooms,module]=await Promise.all([p1,p3,p4])
            console.log(Sujects,classRooms);
            setModules(Sujects); 
            setClassrooms(classRooms);
            setstudentModule(module);
            fetchGrades(Sujects,module);
            setintLoading(false);
            setLoading((prev)=>({...prev,noModules:false}))
            }
            catch(e){

            }
        }
        const fetchPosts=async()=>{
            try{
            const p1=get_posts([Department_id,profile.College_id]);
            const p2= get_users([Department_id,profile.College_id]);
            const [posts,users]=await Promise.all([p1,p2])
            setNotices(posts);
            setusers(users);
            setLoading((prev)=>({...prev,notices:false}));
            }
            catch(e){

            }
        }
        const fetchAssesments= async()=>{
            try{
            const asses=await get_all_student_assesments(profile.registerdModules);
            console.log(asses);
            setassements(asses);
            setLoading((prev)=>({...prev,assesments:false}));
            }
            catch(e){

            }
        }
        const fetchGrades=async(modules,sModules)=>{
            console.log(modules,sModules);
            const grades= await get_students_grade_by_modules(profile.registerdModules);
            console.log(grades,profile.registerdModules);
            let allStudentsArray={};
            let othersGrade={};
            let moduleStNumber={};
            const idNumberMap = profile.registerdModules.reduce((acc, id) => {
                acc[id] = 0;
                console.log(id);
                console.log(acc);
              
                grades.filter((g)=>g.module===id).map((g)=>{
                    if(g.hasOwnProperty("assessmentId") && g.studentId === auth.currentUser.uid)
                    acc[id]+=g.grade
                     if(g.hasOwnProperty("assessmentId") && g.studentId !== auth.currentUser.uid){
                        console.log(g,othersGrade);
                        if(!othersGrade.hasOwnProperty(id))
                        othersGrade[id]=0;
                    othersGrade[id]+=  g.grade;
                    if(moduleStNumber.hasOwnProperty(g.module)){
                        if(!moduleStNumber[g.module].includes(g.studentId)){
                            moduleStNumber[g.module].push(g.studentId);
                            moduleStNumber[g.module]=[g.studentId];
                        } 
                    }else{
                        moduleStNumber[g.module]=[g.studentId];
                    }
                     }
            });
                return acc;
              }, {});
              console.log(idNumberMap);
              const idNumberArray = Object.entries(idNumberMap);
              let otherIdNumberArray=Object.entries(othersGrade);
              console.log(otherIdNumberArray);
              console.log(otherIdNumberArray.map(([id,value])=>{
                console.log(id,moduleStNumber[id],value);
                if(moduleStNumber.hasOwnProperty(id))
                value= +value / +moduleStNumber[id].length;
            return [id,value];
              }));
              otherIdNumberArray=otherIdNumberArray.map(([id,value])=>{
                console.log(id,moduleStNumber[id],value);
                if(moduleStNumber.hasOwnProperty(id))
                value= +value / +moduleStNumber[id].length;
                return [id,value];
              });
              console.log(idNumberArray,otherIdNumberArray,othersGrade,moduleStNumber);
              let s=[];
              let n=[];
              let others=[];
              idNumberArray.map(([id,value])=>{
                s.push(modules.filter((mod)=>mod.id=== sModules.filter((s)=>s.id===id)[0].module)[0].name || "-");
                n.push(value); 
                console.log(id);
                let num=findElementByID(otherIdNumberArray,id) ? findElementByID(otherIdNumberArray,id)[1] :0;
                others.push(num);
              });
              console.log(s,n,others);
              
              setFormativeAsses({modules:s,grades:[{type:"bar",label:"Your grades",data:n},{type:"bar",label:"others grades",data:others}]});
              setLoading((prev)=>({...prev,bars:false}));
              console.log(s,n);
        }
        const fetchSchedule= async(pfm)=>{
            try{
            const p4= await get_student_schedule_Adv(profile.program,profile.level,profile.study || "morning",profile.division || "",profile.registerdModules );
               
            setLoading((prev)=>({...prev,schedule:false}));
            console.log(p4);
            setSchedule(p4);
            console.log(p4,today.getDay());
            }
            catch(e){

            }
        }
        if(profile.Department_id){
        fetchData();
        fetchPosts();
        fetchAssesments();
        fetchSchedule();
        }
    },[profile]);
    if(intLoading){
        return <Loader/>
    }
    return(
        <Box sx={{width:"100%",display:"grid",justifyItems:"center",boxSizing:"border-box"}}>
            <Box sx={{display:"flex",maxWidth:"100vw",boxSizing:"border-box",justifyContent:"center",flexWrap:"wrap",padding:"0.8rem 0.5rem",columnGap:"2rem",rowGap:"0.8rem"}}>
            <Box sx={{display:"flex",flexWrap:"wrap",width:"100%",maxWidth:1100,height:"fit-content",rowGap:"2rem",columnGap:"1rem"}}>
            <InfoCards loading={loading} attendancePercentage={attendancePercentage} lstWeekAttendPer={lstWeekAttendPer} assginments={assginments} noModules={studentModule.length}/>
            <UpcomingClasses assesments={assements}  loading={loading} schedule={schedule} classrooms={classrooms} professorModules={studentModule}  modules={modules}/>
            <Box sx={{flex:"1",minWidth:300,boxShadow:"1"}} >
            <ResponsiveChartContainer  height={300} title="some" sx={{bgcolor:"#fff",borderRadius:"0.5rem"}}  xAxis={[{ scaleType: 'band', data:formativeAsses.modules,id:"x-axis-id" }]}
      series={formativeAsses.grades} text tooltip={{ trigger: 'axis' }}  desc="ggg"> 
            <BarPlot />
            <ChartsText  text="Grades" shapeRendering={true}/>
            <ChartsTooltip/>
            <ChartsXAxis label="Modules" position="bottom" axisId="x-axis-id" />
            <ChartsYAxis position="left" label="Grades"/>
            <ChartsLegend />
    </ResponsiveChartContainer>
           </Box>
           <Box sx={{maxWidth: 350,}}>
           <StudentCalendar  loading={loading} assesments={assements} professorModules={studentModule} classrooms={classrooms} modules={modules}/>
           </Box>
           <Box sx={{flex:"1"}}>
            <Posts users={users} loading={loading} notices={notices}/>
           </Box>
            </Box>
            <Box sx={{overflow:"auto",width:isLargeScreen?"fit-content":"100%",display:"flex",flexDirection:"column",maxWidth:isLargeScreen?"100%":1100,boxSizing:"border-box"}}> 
            <TodaySchedule loading={loading} professorModules={studentModule} modules={schedule} modulesList={modules} classRooms={classrooms} timeStart="8:30" timeEnd="14:30"/>
            </Box>
            </Box>
        </Box>
    );
}
export default Home;