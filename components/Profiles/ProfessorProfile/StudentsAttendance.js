import * as React from 'react';
import {   GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons, } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Box, Button } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { auth, db } from "../../../store/fire";
import Loader from "../../UI/Loader/Loader";
import { useSelector } from "react-redux";
import { get_active_modules, get_Subjects, get_progs, get_professor_modules, get_prof_schedule, get_module_students, get_students_Attendance  } from '../../../store/getandset';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Avatar, Grid, List } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Group } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { TableLoader } from '../DepartmentProfile/Programs/ProgramModules/ProgramModulesTable';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';


export default function StudentsAttendance() {
  const [programs,setPrograms]=React.useState([]);
  const [modules,setModules]=React.useState([]);
  const [professorModules,setProfessorModules]=React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [selectedModules,setSelectedModule]=React.useState("");
  const [selectedLectureCode,setSelectedLectureCode]=React.useState("");
  const [selectedDate,setSelectedDate]=React.useState("");
  const [loading,setLoading]=React.useState(true);
  const [reload,setReload]=React.useState(false);
  const [showSelectionAction,setShowSelectionAction]=React.useState(false);
  const [selectedStudent,setSelectedStudents]=React.useState([]);
  const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const functionMap = {  //store functions refrences
   setSelectedDate,
   setSelectedModule,
   setSelectedLectureCode
    };
    const promise=()=> get_prof_schedule(Department_id,selectedDate !== "" ?selectedDate.$d.getDay():"",selectedModules);
    const {
      data: todayLectures = [],
      isLoading,
      error,
    isFetching, 
    refetch 
    } = useQuery(`Department_id:${Department_id}module:${selectedModules}day:${selectedDate !== "" ?selectedDate.$d.getDay():""}`, promise, {
     enabled:((!!Department_id ) && (selectedModules !== "") && (selectedDate !== "")), 
      refetchOnWindowFocus:false,
    
      select:(data)=>{
       
          return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
          
      }
    }
    );
    const promise2=()=> get_module_students(Department_id,selectedModules);
    const {
      data: moduleStudents = [],
      isLoading2,
      error2,
    isFetching2, 
    refetch2 
    } = useQuery(`Department_id:${Department_id}module:${selectedModules}`, promise2, {
     enabled: ((!!Department_id) && (selectedModules !== "")), 
      refetchOnWindowFocus:false,
    
      select:(data)=>{
        
          return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
          
      }
    }
    );
    const promise3=()=> get_students_Attendance(selectedModules);
    const {
      data: attendances = [],
      isLoading:isLoading3,
      isError:error3,
    isFetching:isFetching3, 
    refetch:refetch3 
    } = useQuery(`module:${selectedModules}`, promise3, {
     enabled: ((!!Department_id) && (selectedModules !== "")), 
      refetchOnWindowFocus:false,
    
      select:(data)=>{
        
          return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
          
      }
    }
    );
    let rows= moduleStudents.map((s)=>({...s,name:s.firstname+" "+s.lastname}));
   console.log(rows);
   console.log(attendances,"att");
   rows=rows.map((row)=>{
if (attendances===0) {
  return {...row}
}
    const StudentsAttendance=attendances.filter((attendance)=>row.id===attendance.studentId)[0];
    console.log(StudentsAttendance,"at");
      return{...row,attendedHours:StudentsAttendance?StudentsAttendance.attendedHours:null,
        attendedId:StudentsAttendance?StudentsAttendance.id:null,
        attended:StudentsAttendance?StudentsAttendance.attended:null

      }
   })
   console.log(rows);
    React.useEffect(()=>{
      const loadModules=async ()=>{
          setLoading(true);
          try{
           
          const p1 = get_professor_modules(Department_id,profile.username);
          const p2 = get_Subjects(Department_id);
          // Access data for each document snapshot in the array
          const [modules,Sujects] = await Promise.all([p1,p2]);
          setModules(Sujects);
          setProfessorModules(modules);
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
    },[reload,profile])
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
    }
  };

  const processRowUpdate = async(newRow) => {
    const updatedRow = { ...newRow, isNew: false };

if(newRow?.attendedId){
  try{
    console.log(newRow);
  await setDoc(doc(db,"attendance",newRow.attendedId),
    {
      attendedHours:newRow.attendedHours,
      studentId:newRow.id,
      module:selectedModules,
      professor:auth.currentUser.uid,
      attended:newRow.attended,
    })
    await refetch3();
  }
  catch(e){
    console.log(e);
  }
}
else{
    try{
      console.log(newRow);
    await addDoc(collection(db,"attendance"),
      {
        attendedHours:newRow.attendedHours,
        studentId:newRow.id,
        module:selectedModules,
        professor:auth.currentUser.uid,
        attended:newRow.attended,
      })
      await refetch3();
    }
    catch(e){
      console.log(e);
    }
  }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'attended',
      headerName: 'Attended',
      type: 'boolean',
      width: 130,
      editable: true,

      
    },
    {
      field: 'attendedHours',
      headerName: `Attended Hours /${3} ` ,
      type: 'number',
      width: 130,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 0 || params.props.value > 3;
        if(hasError){
          
        }
        return { ...params.props, error: hasError };
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 130,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
  
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
  
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            disabled={false}
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  
  const handleChange = (event) => {
    console.log(event);
let funcName='setSelected'+event.target.name;
console.log(funcName);
functionMap[funcName](event.target.value);

 };
 if(loading){
  return <Loader/>
}
  return (
    <Box sx={{ display:"flex",flexDirection:"column",boxSizing:"border-box",flexGrow: "1",width:"100%",padding:"0 0.8rem",marginTop:"0.8rem"}}>
    <AppBar position="static" sx={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px",bgcolor:"transparent",boxShadow:"none",}}>
      <Toolbar sx={{paddingLeft:"0!important",display:"flex",flexWrap:"wrap",gap:"0.9rem",width:"100%"}}>
        <Typography component="span" sx={{flexGrow: 1}}>
        <Typography variant="h5" component="div" sx={{fontFamily:"Graphik",color:"var(--styling1)",display:"inline",marginRight:"0.8rem"}} >
          Students Attendance (make it by lecture id)
        </Typography>
        </Typography>
        <Typography component="span" sx={{width:"100%",display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
        <FormControl
              sx={{minWidth: "8rem", paddingLeft: "0" }}
              size="small"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="date"
                name="Date"
                label="Date"
                labelId="date"
                onChange={(e)=>setSelectedDate(e)}
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
            </FormControl>
        <FormControl sx={{minWidth:"8rem",width:"15%",paddingLeft:"0"}} size="medium" >
        <InputLabel id="module" sx={{color:"var(--styling1) !important"}}>Module</InputLabel>
        <Select
      id="module"
      label="Module"
      labelId="module"
      name="Module"
      onChange={handleChange}
      value={selectedModules}
       sx={{
    bgcolor:"#fff",
    color: 'var(--styling1)',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--styling1) !important'
    },
    '& .MuiSvgIcon-root': {
        color: 'var(--styling1)'
    }
}}
variant="outlined"
    >
     {professorModules.map((p)=> <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
    </Select>
    </FormControl>
    <FormControl sx={{minWidth:"8rem",width:"15%",paddingLeft:"0"}} size="medium">
        <InputLabel id="lectureCode" sx={{color:"var(--styling1) !important"}}>Lecture Code</InputLabel>
            <Select
          id="lectureCode"
          name="LectureCode"
          label="Lecture Code"
          labelId="lectureCode"
          onChange={handleChange}
          disabled={selectedModules === ""}
          value={selectedLectureCode}
           sx={{
        bgcolor:"#fff",
        color: 'var(--styling1)',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--styling1) !important'
        },
        '& .MuiSvgIcon-root': {
            color: 'var(--styling1)'
        }
    }}
    variant="outlined"
        >
     {todayLectures.map((l)=><MenuItem value={l.id}>{l.code}</MenuItem>)}
          
        </Select></FormControl>
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
        <ListItemText sx={{color:"var(--styling1)"}} primary="Students That fully attended lecture" secondary="0" />
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
        <ListItemText sx={{color:"var(--styling1)"}} primary="Students That partially attended lecture" secondary="0"/>
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
        <ListItemText sx={{color:"var(--styling1)"}} primary="Absent students" secondary="0" />
      </ListItem>
      </List>
           </Grid>
           </Grid>
      </Toolbar>
    </AppBar>
    <Box sx={{ height: "600px", width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}>
    {isLoading2 ? <TableLoader/>:
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"

        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{bgcolor:"#fff"}}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onRowSelectionModelChange={(id)=>{if(id.length === 0){setShowSelectionAction(false)}else{setShowSelectionAction(true)}setSelectedStudents(id);}}
        
      />}
    </Box>
    {showSelectionAction && <Button variant='outlined' sx={{width:"15rem",marginTop:"0.5rem"}}>Mark all as Attended</Button>}

    </Box>
  );
}