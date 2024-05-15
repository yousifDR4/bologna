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
import { get_module_students, get_students_grade,get_students_Attendance_byModule, get_active_modules, get_progs, get_Subjects, get_active_completed_modules, get_students_promise } from "../../../../store/getandset";
import { useSelector } from "react-redux";
import { TableLoader } from "../../DepartmentProfile/Programs/ProgramModules/ProgramModulesTable";
import StudentAttendanceTable from "./StudentAttendanceTable";
import StudentAdvancementTable from "./StudentdAdvancmentTable";
function StudentAdvancment() {
    const [selectedModules,setSelectedModule]=useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedProgram,setSelectedProgram]=useState("");
    const [programs, setprograms] = useState([]);
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
            // Access data for each document snapshot in the array
            const [pr,] = await Promise.all([p1,]);
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

    const studentPromise=()=>get_students_promise(Department_id,selectedProgram,selectedLevel);
    const {
      data: students=[],
      isLoading:isLoadingStudents,
      error:iserror,
    isFetching:isFetching, 
     refetch:refetchStudents
    } = useQuery(`department:${Department_id}program:${selectedProgram}level${selectedLevel}`, studentPromise, {
     enabled:((!!Department_id) && selectedProgram !== "" && selectedLevel !== ""),
      refetchOnWindowFocus:false,
      behavior:false,
      select:(data)=>{
        console.log(data.docs);
          return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
      }
    }
    );
  
    return (  <>
  <Box sx={{ display:"flex",flexDirection:"column",boxSizing:"border-box",flexGrow: "1",width:"100%",padding:"0 0.8rem",marginTop:"0.8rem"}}>
    <AppBar position="static" sx={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px",bgcolor:"transparent",boxShadow:"none",}}>
      <Toolbar sx={{paddingLeft:"0!important",display:"flex",flexWrap:"wrap",gap:"0.9rem",width:"100%"}}>
        <Typography component="span" sx={{flexGrow: 1}}>
        <Typography variant="h5" component="div" sx={{fontFamily:"Graphik",color:"var(--styling1)",display:"inline",marginRight:"0.8rem"}} >
          Students Advancement 
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
              </Typography>
              </Toolbar>
              </AppBar>
              <Box sx={{  width: '100%',maxWidth:"100vw",marginTop:"0.7rem" }}>
            <StudentAdvancementTable students={students} 
            loading={ isLoadingStudents}
            program={selectedProgramObject}
            refetch={()=>{ refetchStudents()}}
            slots={{ toolbar: GridToolbar }}
            />
            </Box>
   </Box>
    </>);
}
export default StudentAdvancment;
