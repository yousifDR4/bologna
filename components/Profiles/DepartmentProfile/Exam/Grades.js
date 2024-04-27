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
import { get_Subjects, get_classRooms, get_progs } from "../../../../store/getandset";
import Loader from "../../../UI/Loader/Loader";
import { useSelector } from "react-redux";
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

  const [exams,setExams]=React.useState([]);
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
           const [progs]=await Promise.all([p1])
           console.log(progs);
          setPrograms(progs ? progs : []); 
          setExams(initexams);
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
      field: 'formativeAssesment',
      headerName: 'Formative Assesment',
      type: 'number',
      width: 150,
      
    },
    {
      field: 'midTerm',
      headerName: 'Midterm',
      type: 'number',
      width: 130,
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
    <MenuItem key={index} value={exam.id}>{exam.name}</MenuItem>
  ))
            }
        </Select></FormControl>
        </Typography>
      </Toolbar>
    </AppBar>
    <Box sx={{ height: "400", width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}>
      <DataGrid
        rows={data}
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