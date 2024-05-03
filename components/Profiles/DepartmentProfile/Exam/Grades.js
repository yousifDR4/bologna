import * as React from 'react';
import {   GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons, } from '@mui/x-data-grid';
  import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Box, Snackbar } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { auth } from "../../../../store/fire";
import { get_Subjects, get_active_modules, get_classRooms, get_exams_promise, get_progs } from "../../../../store/getandset";
import Loader from "../../../UI/Loader/Loader";
import { get_assesments_grade, get_module_assesments, get_module_students, get_students_grade } from "../../../../store/getandset";
import { useSelector } from "react-redux";
import { useQuery } from 'react-query';
import Exams from './Exams';
let initexams=[
  {
     id:"01",
      committe:"01",
      level:"2",
      module:"5v1EYMCREB0zpB5OWRwd",
      try:"1",
      program:"JpF0GPA2vFDPRvfgmzMu",
      name:"english first try"
  }
]

const data = [
  { id: 1, name: 'Snow', formativeAssesment: 30, midTerm: 7,endTerm:25,rulingGrade:0,attended:true },
];

export default function Grades() {
  const [programs,setPrograms]=React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [rows, setRows] = React.useState(data);
  const [subjects, setsubjects] = React.useState([]);
  const [selectedProgram,setSelectedProgram]=React.useState("");
  const [selectedLevel,setSelectedLevel]=React.useState("");
  const [selectedExam,setSelectedExam]=React.useState("");
  const [loading,setLoading]=React.useState(true);
  const [reload,setReload]=React.useState(false);
  const [selectedProgramObject,setSelectedProgramObejct]=React.useState(programs.filter((p)=>p.id===selectedProgram)[0]);
  const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const functionMap = {  //store functions refrences
      setSelectedExam,
      setSelectedLevel,
      setSelectedProgram,
    };
    React.useEffect(()=>{
      const loadCommittes=async ()=>{
          setLoading(true);
          try{
          const p1=get_progs(Department_id);
          // Access data for each document snapshot in the array
          // fetch exams 
          const p2 = get_Subjects(Department_id);
           const [progs,sub]=await Promise.all([p1,p2]);
           setsubjects(sub);
           console.log(progs);
          setPrograms(progs ? progs : []); 
          setLoading(false);
          }
          catch(e){
            console.log(e);
              setLoading(false);
          }
      }
      if(Department_id){
      loadCommittes();
      }
    },[reload,profile])
    React.useEffect(()=>{
      setSelectedProgramObejct(programs.filter((p)=>p.id===selectedProgram)[0]);
  },[selectedProgram]);
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const promise3=()=> get_exams_promise(Department_id,selectedProgram);
  const {
    data: exams=[],
    isLoading:isLoading3,
    error:iserrorExam,
  isFetching:isFetchingExam, 
   
  } = useQuery(`exams:${selectedProgram}department:${Department_id}`, promise3, {
   enabled:(!!selectedProgram),
    refetchOnWindowFocus:false,
  
    select:(data)=>{
        return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
    }
  }
  );
  const promise=()=> get_active_modules(Department_id,selectedProgram !== "" ?   programs.filter((p) => p.id === selectedProgram)[0].type :"",+selectedLevel);
  const {
    data: activeMod,
    isLoading,
    error,
  isFetchingPrograms, 
  refetch:refetchPrograms 
  } = useQuery(`Deprartment_id:${Department_id}program:${selectedProgram !== "" ?   programs.filter((p) => p.id === selectedProgram)[0].type :""}level:${+selectedLevel}`, promise, {
   enabled:selectedProgram!=="" && selectedLevel !== "", 
    refetchOnWindowFocus:false,
  
    select:(data)=>{
      console.log(data);
        return data ? data :[]
        
    }
  }
  );
  const studentPromise=()=>get_module_students(Department_id,selectedExam !== ""?exams.filter((e)=>e.id===selectedExam)[0].module:"");
  const {
    data: students=[],
    isLoading:isLoadingStudents,
    error:iserror,
  isFetching:isFetching, 
   refetch
  } = useQuery(`department:${Department_id}module:${selectedExam !== ""?exams.filter((e)=>e.id===selectedExam)[0].module:""}`, studentPromise, {
   enabled:(!!Department_id && selectedExam !== "" ),
    refetchOnWindowFocus:false,
  
    select:(data)=>{
        return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
    }
  }
  );
  const moduleAssesmentPromise=()=>get_module_assesments(selectedExam !== ""?exams.filter((e)=>e.id===selectedExam)[0].module:"");
  const {
    data: moduleAssesments=[],
    isLoading:isLoadingAssesments,
    error:iserror3,
  isFetching:isFetching3, 
   refetch:refetch3
  } = useQuery(`module:${selectedExam !== ""?exams.filter((e)=>e.id===selectedExam)[0].module:""}`, moduleAssesmentPromise, {
   enabled:(!!Department_id && selectedExam !== ""),
    refetchOnWindowFocus:false,
  
    select:(data)=>{
        return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
    }
  }
  );
  const gradepromise=()=>get_assesments_grade(moduleAssesments);
  const {
    data:assesmentsGrades=[],
    isLoading:isLoadingGrades,
    error:iserror2,
  isFetching:isFetching2, 
   refetch:refetch2
  } = useQuery(`module:${moduleAssesments}`, gradepromise, {
   enabled:( moduleAssesments.length > 0 && selectedExam !== ""),
    refetchOnWindowFocus:false,
  
    select:(data)=>{
        return data ? data.docs.map((doc)=>({...doc.data(),docid:doc.id})) :[]
    }
  })
  let modRows=students.map((s)=>{
    let midterm=0,labs=0,onlineAssignments=0,project=0,onsightAssignments=0,quizes=0,reports=0;
    moduleAssesments.filter((m)=>m.type === "AssesmentOnline").map((as)=>{
      assesmentsGrades.filter((asg)=>((asg.assessmentId=== as.id) && (asg.studentId === s.id))).map((asgm)=>onlineAssignments+=asgm.grade);
    });
    moduleAssesments.filter((m)=>m.type === "AssesmentMidTerm").map((as)=>{
      assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id && asg.studentId === s.id)).map((asgm)=>midterm+=asgm.grade);
    });
    moduleAssesments.filter((m)=>m.type === "AssesmentLab").map((as)=>{
      assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id && asg.studentId === s.id)).map((asgm)=>labs+=asgm.grade);
    });
    moduleAssesments.filter((m)=>m.type === "AssesmentOnsight").map((as)=>{
      assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id && asg.studentId === s.id)).map((asgm)=>onsightAssignments+=asgm.grade);
    });
    moduleAssesments.filter((m)=>m.type === "AssesmentProject").map((as)=>{
      assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id && asg.studentId === s.id)).map((asgm)=>project+=asgm.grade);
    });
    moduleAssesments.filter((m)=>m.type === "AssesmentQuizes").map((as)=>{
      assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id && asg.studentId === s.id)).map((asgm)=>quizes+=asgm.grade);
    });
    moduleAssesments.filter((m)=>m.type === "AssesmentReports").map((as)=>{
      assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id && asg.studentId === s.id)).map((asgm)=>reports+=asgm.grade);
    });
    const checks={
      onlineAssignments:onlineAssignments>0?onlineAssignments:"",
      midterm:midterm>0?midterm:"",
      labs:labs>0?labs:"",
      onsightAssignments:onsightAssignments>0?onsightAssignments:"",
      project:project>0?project:"",
      quizes:quizes>0?quizes:"",
      reports:reports>0?reports:"",
      total:onlineAssignments+midterm+labs+onsightAssignments+project+quizes+reports,
    };
    console.log(checks);
    return {...s,name:s.firstname+" "+s.lastname,...checks,totalGrade:checks.total}
  });
  console.log(assesmentsGrades,students,moduleAssesments);
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    console.log((rowModesModel[id]));
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    console.log(newRow);
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const columns = [
    { field: 'name', headerName: 'Name', width: 130 },
    {
      field: 'totalGrade',
      headerName: 'formativeAssesment+Midterm',
      type: 'number',
      width: 250,
      
    },
    {
      field: 'endTerm',
      headerName: 'Endterm',
      type: 'number',
      width: 130,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 0;
        if(hasError){
          
        }
        return { ...params.props, error: hasError };
      },
      editable: true,
    },
    {
      field: 'rulingGrade',
      headerName: 'Ruling Grade',
      type: 'number',
      width: 130,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 0;
        return { ...params.props, error: hasError };
      },
      editable: true,
    },
    {
      field: 'attended',
      headerName: 'Attended',
      type: 'boolean',
      width: 130,
      editable: true,

    },
    {
      field: 'result',
      headerName: 'Result',
      description: 'Sum of previous fields',
      sortable: true,
      width: 160,
      valueGetter: (params) =>
        (+params.row.formativeAssesment || 0) + (+params.row.midTerm || 0) + (+params.row.endTerm || 0) + (+params.row.rulingGrade || 0 ),
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
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
//  let modExam=(exams.length >0 && subjects.length >0 && activeMod.length >0 )? exams.map((e)=>{
//     return{...e,name:subjects.filter(s=>s.id===activeMod.filter((e)=>e.id ===e.module)[0].module)[0].name}
//   }):[];
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
          Students Grades List
        </Typography>
        </Typography>
        <Typography component="span" sx={{width:"100%",display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>

        <FormControl sx={{minWidth:"8rem",width:"15%",paddingLeft:"0"}} size="small" >
        <InputLabel id="program" sx={{color:"var(--styling1) !important"}}>Program</InputLabel>
        <Select
      id="program"
      label="Program"
      labelId="program"
      name="Program"
      onChange={handleChange}
      value={selectedProgram}
       sx={{
    height: '2.5rem',
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
     {programs.map((p)=> <MenuItem value={p.id}>{p.name}</MenuItem>)}
    </Select>
    </FormControl>
    <FormControl sx={{minWidth:"8rem",width:"15%",paddingLeft:"0"}} size="small">
        <InputLabel id="level" sx={{color:"var(--styling1) !important"}}>Level</InputLabel>
            <Select
          id="level"
          name="Level"
          label="Level"
          labelId="level"
          onChange={handleChange}
          disabled={!selectedProgramObject?.type}
          value={selectedLevel}
           sx={{
        height: '2.5rem',
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
            { selectedProgramObject?.type ? [...Array(selectedProgramObject["type"])].map((_, index) => (
    <MenuItem key={index} value={index+1}>{index+1}</MenuItem>
  )):""
            }
        </Select></FormControl>
        <FormControl sx={{minWidth:"8rem",width:"15%",paddingLeft:"0"}} size="small">
        <InputLabel id="exam" sx={{color:"var(--styling1) !important"}}>Exam</InputLabel>
            <Select
          id="exam"
          name="Exam"
          label="Exam"
          labelId="exam"
          onChange={handleChange}
          disabled={!selectedProgramObject?.type}
          value={selectedExam}
           sx={{
        height: '2.5rem',
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
            { exams.map((exam, index) => (
    <MenuItem key={index} value={exam.id}>{exam.id}</MenuItem>
  ))
            }
        </Select></FormControl>
        </Typography>
      </Toolbar>
    </AppBar>
    <Box sx={{ height: "400px", width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}>
      <DataGrid
        rows={modRows}
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
      />
    </Box>
    </Box>
  );
}