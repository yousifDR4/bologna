import { Avatar, Box, Grid, List } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { auth } from "../../../store/fire";
import {
    get_Schedule_promise,
  get_Subjects,
  get_module_schedule_promise,
  get_student_active_modules,
  get_student_attendance_for_module_promise,
} from "../../../store/getandset";
import Loader from "../../UI/Loader/Loader";
import { useSelector } from "react-redux";
import { Fullscreen, Group } from "@mui/icons-material";
import { useQuery } from "react-query";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PresenceTable from "./PresenceTable";
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
const StudentPrecense = () => {
    const [studentModules,setStudentModules]=useState([]);
    const [modules,setModules]=useState([]); 
 const [selectedModule, setSelectedModule] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [refitch, setRefitch] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const functionMap=[
    setSelectedDate,
    setSelectedModule,
  ]
  useEffect(() => {
    console.log("NNNN");
    if (!auth.currentUser) return;
    const f = async () => {
      try {
        setLoading(true);
          const p1 = get_student_active_modules(profile.registerdModules);
          const p2 = get_Subjects(Department_id);
          const [modules,Sujects] = await Promise.all([p1,p2]);
          console.log(modules);
          setModules(Sujects);
          setStudentModules(modules);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    if (Department_id) {
      f();
    }
  }, [refitch, profile, Department_id]);
  const moduleSchedulePromise=()=>get_module_schedule_promise(selectedModule);
  const {
    data: moduleSchedule=[],
    isLoading:isLoadingModuleSchedule,
    error:iserror,
  isFetching:isFetching, 
   refetch:refetch
  } = useQuery(`module:${selectedModule}`, moduleSchedulePromise, {
   enabled:(selectedModule !== "" ),
    refetchOnWindowFocus:false,
  
    select:(data)=>{
        return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
    }
  }
  );
  const studentAttendancePromise=
  ()=>get_student_attendance_for_module_promise(auth.currentUser?.uid?auth.currentUser.uid:"",selectedModule);
  const {
    data: studentAttendance=[],
    isLoading:isLoadingAttendance,
    error:iserror2,
  isFetching:isFetching2, 
   refetch:refetch2
  } = useQuery(`student:${auth.currentUser?.uid?auth.currentUser.uid:""}module:${selectedModule}`, studentAttendancePromise, {
   enabled:(selectedModule !== "" ),
    refetchOnWindowFocus:false,
  
    select:(data)=>{
        return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
    }
  }
  );
  console.log(studentAttendance,moduleSchedule);
  const handleChange = (event) => {
    console.log(event);
    let funcName = "setSelected" + event.target.name;
    console.log(funcName);
    functionMap[funcName](event.target.value);
  };
  let moduleHours=selectedModule !== ""? studentModules.filter((m)=>m.id === selectedModule)[0].ECTS*25:1;
  let totalHours=0,presentHours=0,absentHours=0;
  studentAttendance.map((s)=>{
    totalHours+=s.fullhours;
    if(s.attended){
      presentHours+=s.attendedHours;
    }
    else{
      absentHours+=s.fullhours;
    }
  })
  if (!Department_id ||loading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{ width: "100%", padding: "1.4rem 1rem", boxSizing: "border-box" }}
    >
      <AppBar
        position="static"
        sx={{ bgcolor: "transparent", boxShadow: "none", width: "100%" }}
      >
        <Toolbar
          sx={{
            paddingLeft: "0!important",
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8rem",
          }}
        >
          <Typography component="span" sx={{ width: "100%", display: "flex" }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontFamily: "Graphik",
                color: "var(--styling1)",
                display: "inline",
                marginRight: "0.8rem",
                flex: "1",
              }}
            >
              Attendance
            </Typography>
          
          </Typography>
          <Typography
            component="span"
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
             <FormControl
              sx={{ minWidth: "8rem", width: "15%", paddingLeft: "0" }}
            >
              <InputLabel
                id="module"
                sx={{ color: "var(--styling1) !important" }}
              >
                Module
              </InputLabel>
              <Select
                id="module"
                label="Module"
                name="Module"
                labelId="module"
                onChange={(e)=>setSelectedModule(e.target.value)}
                value={selectedModule}
                sx={{
                  height: "100%",
                  bgcolor: "#fff",
                  color: "var(--styling1)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--styling1) !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "var(--styling1)",
                  },
                }}
                variant="outlined"
              >
                {studentModules.map((mod) => {
                  return (
                    <MenuItem value={mod.id} key={mod.id}>
                      {modules.filter((m)=>m.id===mod.module).length >0?
                      modules.filter((m)=>m.id===mod.module)[0].name:
                      "-"
                    }
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {/* <FormControl
              sx={{ minWidth: "8rem", width: "15%", paddingLeft: "0" }}
              size="small"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="date"
                name="Date"
                label="Date"
                labelId="date"
                onChange={(e)=>setSelectedDate(e)}
                disabled={selectedModule === ""}
                value={selectedDate}
                 sx={{
                  bgcolor:"#fff",
                  color:"var(--styling1) !important",
                  borderColor:"var(--styling1)!important",
                  "& .MuiOutlinedInput-notchedOutline":{
                    color:"var(--styling1) !important",
                    borderColor:"var(--styling1)!important",

                  },
                  "& .Mui-error":{
                    color:"var(--styling1) !important",

                  },
                  "& .MuiOutlinedInput-input":{
                    color:"var(--styling1) !important",

                  },
                  "& .MuiInputLabel-root":{
                    color:"var(--styling1) !important",

                  }
                 }}
              />
              </LocalizationProvider>
            </FormControl> */}
          </Typography>
          <Grid  container sx={{width:"100%", gridTemplateColumns:"1fr 1fr 1fr",display:"grid"}} gridTemplateColumns={{xs:"1fr",sm:"1fr 1fr",lg:"1fr 1fr 1fr",xl:"1fr 1fr 1fr "}} spacing={{xs:1,sm:2,lg:3,xl:8}}>
           <Grid item>
           <List sx={{ width: '100%', maxWidth: 360,bgcolor:"#d1e5f7",borderRadius:"5px"  }}>
      <ListItem sx={{padding:"0px 8px"}}>
        <ListItemAvatar>
          <Avatar sx={{bgcolor:"#fff"}}>
            <Group sx={{color:"var(--styling1)","& .MuiAvatar-root":{bgcolor:"#fff"}}} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText sx={{color:"var(--styling1)"}} primary="Total Hours" secondary={totalHours} />
      </ListItem>
      </List>
           </Grid>
           <Grid item>
           <List sx={{ width: '100%', maxWidth: 360,bgcolor:"#d1e5f7",borderRadius:"5px"  }}>
      <ListItem sx={{padding:"0px 8px"}}>
        <ListItemAvatar>
          <Avatar sx={{bgcolor:"#fff"}}>
            <Group sx={{color:"var(--styling1)","& .MuiAvatar-root":{bgcolor:"#fff"}}} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText sx={{color:"var(--styling1)"}} primary="Present Hours" secondary={<Box sx={{display:"flex",gap:"0.2rem"}}>
          <Typography  margin="0 0.3rem" fontSize="0.875rem"  component="span"> {presentHours} </Typography><Typography title="Percentage of total lectures hours" fontSize="0.875rem" component="span" bgcolor="rgb(252 249 220)"> 
          {selectedModule!==""?(presentHours/totalHours*100):0}% </Typography>
          <Typography margin="0 0.3rem" title="Percentage of total module hours" fontSize="0.875rem" component="span" bgcolor="rgb(231 231 231)"> 
          {Math.round(presentHours/moduleHours*100)}%</Typography>
          </Box>} />
      </ListItem>
      </List>
           </Grid>
           <Grid item>
           <List sx={{ width: '100%', maxWidth: 360,bgcolor:"#d1e5f7",borderRadius:"5px"  }}>
      <ListItem sx={{padding:"0px 8px"}}>
        <ListItemAvatar>
          <Avatar sx={{bgcolor:"#fff"}}>
            <Group sx={{color:"var(--styling1)","& .MuiAvatar-root":{bgcolor:"#fff"}}} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText sx={{color:"var(--styling1)"}} primary="Absense Hours" secondary={<Box sx={{display:"flex",gap:"0.2rem"}}>
          <Typography  margin="0 0.3rem" fontSize="0.875rem"  component="span"> {absentHours} </Typography><Typography title="Percentage of total lectures hours" fontSize="0.875rem" component="span" bgcolor="rgb(252 249 220)"> 
          {selectedModule!==""?absentHours/totalHours*100:0}% </Typography>
          <Typography title="Percentage of total module hours" margin="0 0.3rem" fontSize="0.875rem" component="span" bgcolor="rgb(231 231 231)"> 
          {Math.round(absentHours/moduleHours*100)}%</Typography>
          </Box>} />
      </ListItem>
      </List>
           </Grid>
           </Grid>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          overflow: "auto",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <PresenceTable attendance={studentAttendance} lectures={moduleSchedule}/>
      
      </Box>
    </Box>
  );
};
export default StudentPrecense;