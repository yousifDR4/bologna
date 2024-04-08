import {useEffect, useState} from 'react';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { get_Sujects,get_active_modules,get_modules, get_prof, get_progs } from '../../../../store/getandset';
import { auth } from '../../../../store/fire';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useSelector } from 'react-redux';
import { Box,FormControlLabel ,Checkbox, MenuItem, Skeleton, Stack, Typography, Button } from '@mui/material';
import { useQuery } from "react-query";
import Loader from '../../../UI/Loader/Loader';
import { DataGrid, GridActionsCellItem, GridNoRowsOverlay } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';
import AddDivision from './AddDivision';
import AddStudentsDivision from './AddStudentsDivision';

const Divsions = () => {
  const [divisions, setDivisions] = useState([]);
  const [students,setStudents]=useState([]);
  const [regEnabled,setRegEnabled]=useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
    const [studyType, setstudyType] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDivision, setselectedDivision] = useState("");
  const [programs, setPrograms] = useState([]);
  const [loading,setLoading]=useState(true);
  const [selectedProgramObject, setSelectedProgramObejct] = useState(
    programs.filter((p) => p.id === selectedProgram)[0]
  );
  const profile = useSelector((state) => state.profile.profile);
  const Department_id= profile.Department_id;
  useEffect(() => {
    setSelectedProgramObejct(
      programs.filter((p) => p.id === selectedProgram)[0]
    );
    console.log(selectedProgramObject);

  }, [selectedProgram]);
  useEffect(()=>{

    if(!auth.currentUser)
    return;
    const f=async()=>{
      console.log(1111);
const p2 = get_progs(Department_id);
// Access data for each document snapshot in the array
const [progs] = await Promise.all([ p2]);
setPrograms(progs);
setLoading(false);
    }
    f();

  },[profile])



  const columns = [
    {
        field: 'id',
        headerName: 'id',
        width: 150,
      },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'studyType',
    headerName: 'Study Type',
    width: 150,
  },
  {
    field: 'speciality',
    headerName: 'Speciality',
    width: 150,
  },
  ];
let rows=[];

if (loading){
  return <Loader/>
}
  return (
    <>
    <Box sx={{ display:"flex",flexDirection:"column",boxSizing:"border-box",flexGrow: "1",width:"100%",padding:"0 0.8rem",marginTop:"0.8rem"}}>
    <AppBar position="static" sx={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px",bgcolor:"transparent",boxShadow:"none",}}>
      <Toolbar sx={{paddingLeft:"0!important",display:"flex",flexWrap:"wrap",gap:"0.9rem",width:"100%"}}>
        <Typography component="span" sx={{flexGrow: 1,display:"flex"}}>
        <Typography variant="h5" component="div" sx={{fontFamily:"Graphik",color:"var(--styling1)",display:"inline",marginRight:"0.8rem"}} >
          Divisions
        </Typography>
        <AddDivision studyType={studyType} program={selectedProgram} level={selectedLevel} edit={false}/>
        </Typography>
        <Typography component="span" sx={{width:"100%",display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
        <FormControl
              sx={{ minWidth: "8rem", width: "15%", marginLeft: "0.5rem",marginBottom:"0.5rem" }}
              size="small"
            >
              <InputLabel
             
                id="program"
                sx={{color:"var(--styling1) !important",
             
            }}
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
                  height: '2.5rem',
                  bgcolor:"#fff",
                  color: 'var(--styling1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--styling1) !important'
                  },
                  '& .MuiSvgIcon-root': {
                      color: 'var(--styling1)'
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
              sx={{ minWidth: "8rem", width: "15%", marginLeft: "0.5rem",marginBottom:"0.5rem" }}
              size="small"
            >
              <InputLabel
                id="studyType"
                disabled={selectedProgram === ""}
                sx={{color:"var(--styling1) ",
                "& .Mui-disabled" :{
                    color:"#000 !important"
                  }
            
            }}
              >
                Study Type
              </InputLabel>
              <Select
                id="studyType"
                label="Study Type"
                name="studyTyoe"
                labelId="studyType"
                onChange={(e)=>(setstudyType(e.target.value))}
                value={studyType}
                defaultValue='morning'
                disabled={selectedProgram === ""}
                sx={{
                  height: '2.5rem',
                  bgcolor:"#fff",
                  color: 'var(--styling1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--styling1)'
                  },
                  '& .Mui-disabled.MuiSvgIcon-root': {
                      color: 'rgba(0, 0, 0, 0.26) !important'
                  },
                  '&  .MuiSvgIcon-root': {
                      color: 'var(--styling1) '
                  },

                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--styling1) !important'
                },
                  "& .Mui-disabled .MuiOutlinedInput-notchedOutline":{
                    borderColor: '#000 !important',
                    color: "#000 !important"

                  },
              }}
                variant="outlined"
              >
                <MenuItem value="morning" key="morning">Morning Study</MenuItem>
               {selectedProgramObject?.eveningStudy ? selectedProgramObject.eveningStudy ?
                 <MenuItem value="evening" key="evening">Evening Study</MenuItem>:"":""
            }

              </Select>
            </FormControl>
            <FormControl
              sx={{ minWidth: "8rem", width: "15%", marginLeft: "0.5rem" }}
              size="small"
            >
              <InputLabel
                id="level"
                sx={{color:"var(--styling1) !important"}}
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
                id="division"
                sx={{color:"var(--styling1) !important"}}
              >
                Division
              </InputLabel>
              <Select
                id="division"
                name="Division"
                label="Division"
                labelId="Division"
                onChange={(e)=>setselectedDivision(e.target.value)}
                disabled={selectedLevel === "" || studyType === ""}
                value={selectedDivision}
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
             
              </Select>
            </FormControl>
            </Typography>
      </Toolbar>
    </AppBar>
    <Box   sx={{ height: "400px", bgcolor:"#fff",width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}>
  { true ?
  
            <DataGrid 
    
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        slotProps={{
          GridNoRowsOverlay: ()=>(
            <Typography textAlign="center" variant='subtitle1' marginY={1} color="text.secondary">No Students were found!</Typography>
  ),
  noResultsOverlay:()=>(
    <Typography textAlign="center" variant='subtitle1' marginY={1} color="text.secondary">No Students were found!</Typography>

  )
        }}
        
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        
      />:<TableLoader/>
}

</Box>
{selectedDivision !== "" || true && <AddStudentsDivision division={selectedDivision} students={students} />}
</Box>
</>
  );
};
export default Divsions;

export const TableLoader=()=>{
  return(
    <Stack spacing={1} marginTop="0.8rem" sx={{height:"40rem",width:"100%"}}>
      
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
    </Stack>
  )
}
