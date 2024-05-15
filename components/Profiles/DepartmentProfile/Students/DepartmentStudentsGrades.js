import { useEffect, useState } from "react";
import { DataGrid,GridToolbar  } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, Checkbox, FormControlLabel, List, ListItem, ListItemText, MenuItem, Tab, Tabs, Typography } from "@mui/material";
import { Grade, Person2Outlined } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputLabel from '@mui/material/InputLabel';
import { useQueries, useQuery } from "react-query";
import { get_module_students, get_progs, get_Subjects, get_assesments_grade, get_module_assesments, get_active_completed_modules, get_control  } from "../../../../store/getandset";
import { useSelector } from "react-redux";
import clsx from 'clsx';
import { TableLoader } from "../../DepartmentProfile/Programs/ProgramModules/ProgramModulesTable";
import StudentAttendanceTable from "./StudentAttendanceTable";
import { addDoc, arrayUnion, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../store/fire";
import Confirm from "../../../UI/Confirm/Confirm";
function DepartmentStudentsGrades() {
    const [selectedModules,setSelectedModule]=useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedProgram,setSelectedProgram]=useState("");
    const [programs, setprograms] = useState([]);
    const [modules, setmodules] = useState([]);
    const [confirmOpen,setConfirmOpen]=useState(false);
    const [Uploading,setUploading]=useState(false);
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
      const promiseControl=()=> get_control(Department_id,selectedProgramObject?.type ? selectedProgramObject.type : "");
      const {
        data: control={},
        isLoading:isLoadingControl,
        error:isErrorControl,
      isFetching:isFetchingControl, 
      refetch:refetchControl 
      } = useQuery(`department:${Department_id}program:${selectedProgramObject?.type ? selectedProgramObject.type : ""}`, promiseControl, {
       enabled:(!!Department_id && selectedProgram !== "" ),
        refetchOnWindowFocus:false,
      
        select:(data)=>{
            return data ? {...data.docs[0].data(),id:data.docs[0].id} :{}
        }
      }
      );

      const promise = () =>
      get_active_completed_modules(
        Department_id,
        selectedProgram !== ""
          ? programs.filter((p) => p.id === selectedProgram)[0].type
          : "",
        +selectedLevel
      );
    const {
      data: activeMod,
      isLoading:isLoadingActiveModules,
      error,
      isFetching:isFetchingMod,
      refetch: refetchMod,
    } = useQuery(
      `Deprartment_id:${Department_id}program:${
        selectedProgram !== ""
          ? programs.filter((p) => p.id === selectedProgram)[0].type
          : ""
      }level:${+selectedLevel}`,
      promise,
      {
        enabled: selectedProgram !== "" && selectedLevel !== "",
        refetchOnWindowFocus: false,
  
        select: (data) => {
          console.log(data);
          return data ? data : [];
        },
      }
    );
    const studentPromise = () =>
      get_module_students(
        Department_id,
        selectedModules
      );
    const {
      data: students = [],
      isLoading: isLoadingStudents,
      error: iserror,
      isFetching: isFetching,
      refetch:refetchStudents,
    } = useQuery(
      `department:${Department_id}module:${
       selectedModules
      }`,
      studentPromise,
      {
        enabled: !!Department_id && selectedModules !== "",
        refetchOnWindowFocus: false,
  
        select: (data) => {
          return data
            ? data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            : [];
        },
      }
    );
    const moduleAssesmentPromise = () =>
      get_module_assesments(
       selectedModules
      );
    const {
      data: moduleAssesments = [],
      isLoading: isLoadingAssesments,
      error: iserror3,
      isFetching: isFetching3,
      refetch: refetch3,
    } = useQuery(
      `module:${
       selectedModules
      }`,
      moduleAssesmentPromise,
      {
        enabled: !!Department_id && selectedModules !== "",
        refetchOnWindowFocus: false,
  
        select: (data) => {
          return data
            ? data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            : [];
        },
      }
    );
    const gradepromise = () => get_assesments_grade(moduleAssesments);
    const {
      data: assesmentsGrades = [],
      isLoading: isLoadingGrades,
      error: iserror2,
      isFetching: isFetching2,
      refetch: refetch2,
    } = useQuery(`module:${moduleAssesments}`, gradepromise, {
      enabled: moduleAssesments.length > 0 && selectedModules !== "",
      refetchOnWindowFocus: false,
  
      select: (data) => {
        return data
          ? data.docs.map((doc) => ({ ...doc.data(), docid: doc.id }))
          : [];
      },
    });
    let modRows = students.map((s) => {
      let midterm = 0,
        labs = 0,
        onlineAssignments = 0,
        project = 0,
        onsightAssignments = 0,
        quizes = 0,
        reports = 0;
      moduleAssesments
        .filter((m) => m.type === "AssesmentOnline")
        .map((as) => {
          assesmentsGrades
            .filter((asg) => asg.assessmentId === as.id && asg.studentId === s.id)
            .map((asgm) => (onlineAssignments += asgm.grade));
        });
      moduleAssesments
        .filter((m) => m.type === "AssesmentMidTerm")
        .map((as) => {
          assesmentsGrades
            .filter((asg) => asg.assessmentId === as.id && asg.studentId === s.id)
            .map((asgm) => (midterm += asgm.grade));
        });
      moduleAssesments
        .filter((m) => m.type === "AssesmentLab")
        .map((as) => {
          assesmentsGrades
            .filter((asg) => asg.assessmentId === as.id && asg.studentId === s.id)
            .map((asgm) => (labs += asgm.grade));
        });
      moduleAssesments
        .filter((m) => m.type === "AssesmentOnsight")
        .map((as) => {
          assesmentsGrades
            .filter((asg) => asg.assessmentId === as.id && asg.studentId === s.id)
            .map((asgm) => (onsightAssignments += asgm.grade));
        });
      moduleAssesments
        .filter((m) => m.type === "AssesmentProject")
        .map((as) => {
          assesmentsGrades
            .filter((asg) => asg.assessmentId === as.id && asg.studentId === s.id)
            .map((asgm) => (project += asgm.grade));
        });
      moduleAssesments
        .filter((m) => m.type === "AssesmentQuizes")
        .map((as) => {
          assesmentsGrades
            .filter((asg) => asg.assessmentId === as.id && asg.studentId === s.id)
            .map((asgm) => (quizes += asgm.grade));
        });
      moduleAssesments
        .filter((m) => m.type === "AssesmentReports")
        .map((as) => {
          assesmentsGrades
            .filter((asg) => asg.assessmentId === as.id && asg.studentId === s.id)
            .map((asgm) => (reports += asgm.grade));
        });
      const checks = {
        onlineAssignments: onlineAssignments > 0 ? onlineAssignments : "",
        midterm: midterm > 0 ? midterm : "",
        labs: labs > 0 ? labs : "",
        onsightAssignments: onsightAssignments > 0 ? onsightAssignments : "",
        project: project > 0 ? project : "",
        quizes: quizes > 0 ? quizes : "",
        reports: reports > 0 ? reports : "",
        formativeAssesment:
        onlineAssignments +
        labs +
        onsightAssignments +
        project +
        quizes +
        reports,
      };
      return {
        ...s,
        name: s.firstname + " " + s.lastname,
        ...checks,
        formativeAssesment: checks.formativeAssesment,
      };
    });

    let namedActiveMods=[];
    if(activeMod){
        namedActiveMods=activeMod.map((ac)=>(
            {name:modules.filter(mod=>mod.id === ac.module).length > 0?modules.filter(mod=>mod.id === ac.module)[0].name:"Module Not Found",...ac}
        ))
    }

    const HandleConfirmation=async ()=>{
        if(Object.keys(control).length < 1){
          try{
            setUploading(true);
            
            const id = await addDoc(collection(db, "Control"), {
              Department_id: Department_id,
              program: selectedProgramObject.type,
              enableAssesments: {[+selectedLevel]:true}
            });
          }
          catch(e){
            console.log(e);
          }
          finally{
            setUploading(false);
            refetchControl();
          }
        }
        else{
            setUploading(true);
        try{
          console.log("setting");
          let obj=control.hasOwnProperty("enableAssesments")?control.enableAssesments:{};
          let value=obj.hasOwnProperty(+selectedLevel)?!obj[+selectedLevel]:true;
        let p1= setDoc(doc(db, "Control",control.id), {
          ...control,
          enableAssesments: 
            {...obj,[+selectedLevel]:value}
        });
            if(!value){
           let fStuds= modRows.filter((r)=>r.formativeAssesment <14);
           let ids=[];
           fStuds.map((s)=>ids.push(s.id));
           console.log(ids);
            const promises = ids.map(async (id) => {
              try {
                console.log("Processing for ID:", id);
                await setDoc(doc(db, "users", id), {
                  failedModules: arrayUnion(selectedModules),
                  registerdModules: modRows
                    .filter((r) => r.id === id)[0]
                    .registerdModules.filter(
                      (e) => e !==selectedModules
                    ),
                }, { merge: true });
                console.log("Processed for ID:", id);
              } catch (e) {
                console.log("Error for ID:", id, e);
              }
            });
            await Promise.all([...promises,p1]);
        }
        else{
            await Promise.all([p1]);
        }
      }
      catch(e){
        console.log(e);
      }
      finally{
        setUploading(false);
        refetchControl();
        refetchStudents();
      }
      }
    }

    const columns = [
        {
          field: 'name',
          headerName: 'Student Name',
          width: 200,
          type:"text"

        },
        {
          field: 'Division',
          headerName: 'Student Division',
          width: 150,
          type:"number"

        },
        {
          field: 'midterm',
          headerName: 'Midterm',
          width: 130,
          type:"number"

        },
        {
          field: 'labs',
          headerName: 'Labs',
          width: 130,
          type:"number"

        },
        {
          field: 'onlineAssignments',
          headerName: 'Online Assignments',
          width: 130,
          type:"number"

        },
        {
          field: 'project',
          headerName: 'Project',
          width: 130,
          type:"number"

        },
        {
          field: 'onsightAssignments',
          headerName: 'Onsight Assignments',
          width: 130,
          type:"number"

        },
        {
          field: 'reports',
          headerName: 'Reports',
          width: 130,
          type:"number"
        },
        {
          field: "quizes",
          headerName: "Quizes",
          width:100,
          type:"number"
        },
        {
          field: 'totalGrade',
          headerName: 'Formative Assesment',
          width: 130,
          valueGetter: (params) =>
           (+params.row.labs || 0) + (+params.row.onlineAssignments || 0) + (+params.row.project || 0 ) + (+params.row.onsightAssignments || 0 ) + (+params.row.reports || 0 ) + (+params.row.quizes || 0 ),
          cellClassName: (params) => {
            if (params.value == null) {
              return '';
            }
      
            return clsx('super-app', {
              negative: params.value < 14,
              positive: params.value >= 14,
            });
        },
        },
      ];
    let isLoading= isLoadingAssesments || isLoadingGrades || isLoadingStudents;
    return (  <>
     <Confirm open={confirmOpen} setOpen={setConfirmOpen} message={`Are you sure you want to ${control?.enableAssesments ? 
    control.enableAssesments.hasOwnProperty(+selectedLevel)?
    control.enableAssesments[+selectedLevel]?
       "disable Assesments, any students with Formative assesments less than 14 in any modules will fail thess modules"
       : "enable Assesments":"enable Assesments":"enable Assesments"} ,
       `}
        title={`${(control?.enableAssesments ? 
          control.enableAssesments.hasOwnProperty(+selectedLevel)?
          control.enableAssesments[+selectedLevel]:false : false) ?
          "Disable":"enable"} Assesmnets for level ${+selectedLevel}`} 
        handleResult={(res)=>{if(res){HandleConfirmation()}}}/>
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
            <FormControl  size='small' sx={{display:"grid",alignItems:"center",justifyItems:"center",padding:"0rem 0.3rem",marginBottom:"8px",border:"1px solid rgba(25, 118, 210, 0.5)",borderColor:selectedLevel === ""?"text.secondary":"var(--styling1)",borderRadius:"4px",color:"#1976d2"}}>
      <FormControlLabel sx={{margin:"0"}} 
      control={<Checkbox  checked={control.hasOwnProperty("enableAssesments")?control.enableAssesments.hasOwnProperty(+selectedLevel)?control.enableAssesments[+selectedLevel]:false:false} 
      onClick={()=>setConfirmOpen(true)} 
      sx={{padding:"0",color:'var(--styling1)'}} disabled={selectedProgram === "" || selectedLevel === "" ||isFetchingControl} />}
       title='Enable Students to register for modules' 
       label=" Enable Grading Assesments" />
      </FormControl>
              </Typography>
              </Toolbar>
              </AppBar>
              <Box sx={{ height: "600px", width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem",
             '& .super-app-theme--cell': {
                backgroundColor: 'rgba(224, 183, 60, 0.55)',
                color: '#1a3e72',
                fontWeight: '600',
              },
              '& .super-app.negative': {
                backgroundColor: 'rgb(253, 237, 237)',
                color: '#080f1a',
                fontWeight: '600',
              },
              '& .super-app.positive': {
                backgroundColor: '#DEF3F1',
                color: '#080f1a',
                fontWeight: '600',
              }, }}>
            {isLoading?<TableLoader/>:  <DataGrid 
      sx={{ height: "500", bgcolor:"#fff",width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem", }}
        rows={modRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        
        pageSizeOptions={[5,10,20]}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
      />
    }
            </Box>
   </Box>
    </>);
}
export default DepartmentStudentsGrades;
