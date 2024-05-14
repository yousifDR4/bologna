import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, List, ListItem, ListItemText, MenuItem, Tab, Tabs, Typography } from "@mui/material";
import { Grade, Person2Outlined } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputLabel from '@mui/material/InputLabel';
import { useQueries, useQuery } from "react-query";
import { get_module_students, get_students_grade,get_students_Attendance_byModule, get_active_modules, get_progs, get_Subjects, get_active_completed_modules } from "../../../../store/getandset";
import { useSelector } from "react-redux";
import { TableLoader } from "../../DepartmentProfile/Programs/ProgramModules/ProgramModulesTable";
import StudentAttendanceTable from "./StudentAttendanceTable";
function DepartmentStudentsAttendance() {
    const [selectedModules,setSelectedModule]=useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedProgram,setSelectedProgram]=useState("");
    const [programs, setprograms] = useState([]);
    const [modules, setmodules] = useState([]);
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const [selectedProgramObject, setSelectedProgramObejct] = useState(
        programs.filter((p) => p.id === selectedProgram)[0]
      );
    const [Loading, setLoading] = useState(true);
    useEffect(()=>{
        const loadModules=async ()=>{
            setLoading(true);
            try{
            const p1= get_progs(Department_id);
            const p2 = get_Subjects(Department_id);
            // Access data for each document snapshot in the array
            const [pr,Sujects] = await Promise.all([p1,p2]);
            setmodules(Sujects);
            setprograms(pr);
            setLoading(false);
            }
            catch(e){
              console.log(e);
                setLoading(false);
            }
        }
        if(Department_id !== ""){
        loadModules();
        }
      },[profile])

      useEffect(() => {
        setSelectedProgramObejct(
          programs.filter((p) => p.id === selectedProgram)[0]
        );
        console.log(selectedProgramObject);
      }, [selectedProgram]);

      const promise=()=> get_active_completed_modules(Department_id,selectedProgram !== "" ?   programs.filter((p) => p.id === selectedProgram)[0].type :"",+selectedLevel);
      const {
        data: activeMod=[],
        isLoading,
        error,
      isFetching:isFetching2, 
      refetch:refetch2 
      } = useQuery(`Deprartment_id:${Department_id}program:${selectedProgram !== "" ?   programs.filter((p) => p.id === selectedProgram)[0].type :""}level:${+selectedLevel}`, promise, {
       enabled:selectedProgram!=="" && selectedLevel !== "", 
        refetchOnWindowFocus:false,
        behavior:false,
        select:(data)=>{
            return data ? data :[]
            
        }
      }
      );  
    const studentPromise=()=>get_module_students(Department_id,selectedModules);
    const {
      data: students=[],
      isLoading:isLoadingStudents,
      error:iserror,
    isFetching:isFetching, 
     refetch:refetchStudents
    } = useQuery(`department:${Department_id}module:${selectedModules}`, studentPromise, {
     enabled:((!!Department_id) && (selectedModules !== "")),
      refetchOnWindowFocus:false,
      behavior:false,
      select:(data)=>{
        console.log(data.docs);
          return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
      }
    }
    );
    const promise3=()=> get_students_Attendance_byModule(selectedModules);
    const {
      data: attendances = [],
      isLoading:isLoading3,
      isError:error3,
    isFetching:isFetching3, 
    refetch:refetch3 
    } = useQuery(`module:${selectedModules}`, promise3, {
     enabled: ((!!Department_id) && (selectedModules !== "")), 
      refetchOnWindowFocus:false,
      behavior:false,
      select:(data)=>{
        
          return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
          
      }
    }
    );
    console.log(iserror,error3);
    let namedActiveMods=[];
    if(activeMod){
        namedActiveMods=activeMod.map((ac)=>(
            {name:modules.filter(mod=>mod.id === ac.module).length > 0?modules.filter(mod=>mod.id === ac.module)[0].name:"Module Not Found",...ac}
        ))
    }
    return (  <>
  <Box sx={{ display:"flex",flexDirection:"column",boxSizing:"border-box",flexGrow: "1",width:"100%",padding:"0 0.8rem",marginTop:"0.8rem"}}>
    <AppBar position="static" sx={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px",bgcolor:"transparent",boxShadow:"none",}}>
      <Toolbar sx={{paddingLeft:"0!important",display:"flex",flexWrap:"wrap",gap:"0.9rem",width:"100%"}}>
        <Typography component="span" sx={{flexGrow: 1}}>
        <Typography variant="h5" component="div" sx={{fontFamily:"Graphik",color:"var(--styling1)",display:"inline",marginRight:"0.8rem"}} >
          Students Attendance 
        </Typography>
        </Typography>
        <Typography component="span" sx={{width:"100%",display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
      <FormControl
            sx={{ minWidth: "8rem", width: "15%",marginBottom:"0.5rem" }}
            size="small"
          >
            <InputLabel
              id="program"
              sx={{ color: "var(--styling1) !important" }}

            >
              Program
            </InputLabel>
            <Select
              id="program"
              label="Program"
              name="Program"
              labelId="program"
              onChange={(e)=>(setSelectedProgram(e.target.value))}
              value={selectedProgram}
              sx={{
                height: "2.5rem",
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
              {programs.map((prog) => {
                return (
                  <MenuItem value={prog.id} key={prog.id}>
                    {prog.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            sx={{ minWidth: "8rem", width: "15%", marginLeft: "0.5rem" }}
            size="small"
          >
            <InputLabel
              id="level"
              sx={{ color: "var(--styling1) !important" }}

            >
              Level
            </InputLabel>
            <Select
              id="level"
              name="Level"
              label="Level"
              labelId="level"
              onChange={(e)=>setSelectedLevel(e.target.value)}
              disabled={!selectedProgramObject?.type}
              value={selectedLevel}
              sx={{
                height: "2.5rem",
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
              {selectedProgramObject?.type
                ? [...Array(selectedProgramObject["type"])].map(
                    (_, index) => (
                      <MenuItem key={index} value={index + 1}>
                        {index + 1}
                      </MenuItem>
                    )
                  )
                : ""}
            </Select>
          </FormControl>
          <FormControl
            sx={{ minWidth: "8rem", width: "15%", marginLeft: "0.5rem" }}
            size="small"
          >
            <InputLabel
              id="module"
              sx={{ color: "var(--styling1) !important" }}
            >
              Module
            </InputLabel>
            <Select
              id="module"
              name="Module"
              label="Module"
              labelId="Module"
              onChange={(e)=>setSelectedModule(e.target.value)}
              disabled={selectedLevel === ""}
              value={selectedModules}
              sx={{
                height: "2.5rem",
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
              {
                namedActiveMods.map((ac)=>
                <MenuItem value={ac.id}>{ac.name}</MenuItem>
                )
              }
            </Select>
          </FormControl>
              </Typography>
              </Toolbar>
              </AppBar>
              <Box sx={{ height: "600px", width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}>
            <StudentAttendanceTable students={students} 
            attendances={attendances} 
            module={namedActiveMods.filter((ac)=>ac.id===selectedModules)[0]} 
            loading={isLoading || isLoading3 || isLoadingStudents}
            refetch={()=>{ refetchStudents(); refetch3();}}
            slots={{ toolbar: GridToolbar }}
            />
            </Box>
   </Box>
    </>);
}
export default DepartmentStudentsAttendance;
