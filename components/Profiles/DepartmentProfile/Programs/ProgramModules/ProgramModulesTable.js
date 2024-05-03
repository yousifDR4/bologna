import {useEffect, useState} from 'react';
import classes from "./ProgramModulesTable.module.css"
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import {
    Table,
    Header,
    HeaderRow,
    HeaderCell,
    Body,
    Row,
    Cell,
  } from '@table-library/react-table-library/table';
  import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { HeaderCellSort, useSort } from '@table-library/react-table-library/sort';
import { get_Sujects,get_active_modules,get_modules, get_prof, get_progs } from '../../../../../store/getandset';
import { auth } from '../../../../../store/fire';
import { useSelector } from 'react-redux';
import { Box, MenuItem, Skeleton, Stack, Typography } from '@mui/material';
import { useQuery } from "react-query";
import Loader from '../../../../UI/Loader/Loader';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Delete } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditProgramModule from "../add_program_module/EditProgramModule"

const ProgramModulesTable = () => {
  const [modules,setModules]=useState([]);
  const [professors,setProfessors]=useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [programs, setPrograms] = useState([]);
  const [loading,setLoading]=useState(true);
  const [selectedProgramObject, setSelectedProgramObejct] = useState(
    programs.filter((p) => p.id === selectedProgram)[0]
  );
  const profile = useSelector((state) => state.profile.profile);
  const Department_id= profile.Department_id;
  const professorsIds=profile.professors;
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
const p1=get_modules(Department_id);
const p2 = get_progs(Department_id);
const p3=get_prof(professorsIds)
// Access data for each document snapshot in the array
const [mod,progs,porfs] = await Promise.all([p1, p2,p3]);
console.log(mod,porfs);

setModules(mod);
setPrograms(progs);
setProfessors(porfs);
setLoading(false);
    }
    f();
  },[profile])
const promise=()=> get_active_modules(Department_id,selectedProgram !== "" ?   programs.filter((p) => p.id === selectedProgram)[0].type :"",+selectedLevel);
  const {
    data: activeMod,
    isLoading,
    error,
  isFetching, 
  refetch 
  } = useQuery(`Deprartment_id:${Department_id}program:${selectedProgram !== "" ?   programs.filter((p) => p.id === selectedProgram)[0].type :""}level:${+selectedLevel}`, promise, {
   enabled:selectedProgram!=="" && selectedLevel !== "", 
    refetchOnWindowFocus:false,
  
    select:(data)=>{
      console.log(data);
        return data ? data :[]
        
    }
  }
  );
  const columns = [
    {
        field: 'code',
        headerName: 'Code',
        width: 200,
      },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },
  {
  field: 'revisor',
  headerName: 'Revisor',
  width: 200,
},

{
  field: 'manager',
  headerName: 'Manager',
  width: 160,
},
{
  field: 'midTermHours',
  headerName: 'Midterm Hours',
  width: 160,
},
{
  field:"activated",
  headerName:"Activated",
  width:150,
  type:"boolean"
},
{
  field: 'actions',
  type: 'actions',
  headerName: 'Actions',
  width: 130,
  cellClassName: 'actions',
  getActions: ({ id }) => {
    console.log(id);
    return [
      <EditProgramModuleDialogue refetch={refetch} moduleProp={activeMod.filter((mod)=>mod.id===id)[0]} modules={modules}/>,
      <GridActionsCellItem
      icon={<Delete />}
      label="Delete"
      className="textPrimary"
      color="inherit"
    />,
    ];
  },
},
];
let rows=[];
if(activeMod){
activeMod.map((act)=>{
console.log(professors);
console.log(professors.filter(mod=>mod.username === act.manager).length > 0?professors.filter(mod=>mod.username === act.manager)[0]:"Module Not Found",);
rows.push({...act,activated:+act.progress === 100,
  manager:professors.filter(mod=>mod.username === act.manager).length > 0?professors.filter(mod=>mod.username === act.manager)[0].username:"Module Not Found",
  revisor:professors.filter(mod=>mod.username === act.revisor).length > 0?professors.filter(mod=>mod.username === act.revisor)[0].username:"Module Not Found",
  name:modules.filter(mod=>mod.id === act.module).length > 0?modules.filter(mod=>mod.id === act.module)[0].name:"Module Not Found",
})

})
console.log(rows);
}

if (loading){
return <Loader/>
}
return (
  <div className={classes.container}>
      <div className={classes.table}>
      <h3>View modules</h3>
      <FormControl
            sx={{ minWidth: "8rem", width: "15%", marginLeft: "0.5rem",marginBottom:"0.5rem" }}
            size="small"
          >
            <InputLabel
              id="program"
             
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

          { isLoading?<TableLoader/> : rows.length > 0?
            <DataGrid 
      sx={{ height: "400", bgcolor:"#fff",width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        
      />:<Typography textAlign="center" marginY={1} color="text.secondary">No Modules were found!</Typography>
}
    </div>
    </div>
  );
};
export default ProgramModulesTable;

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
export  function EditProgramModuleDialogue(probs) {
    let {moduleProp,refetch,modules}=probs;
    console.log(moduleProp);
    const [open, setOpen] = useState(false);
    const [value,setValue]=useState("1");
    const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };
      const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    return (
        <>
          <Button   variant="outlined" onClick={handleClickOpen} sx={{border:"none",borderRadius:"50%",width:"50%",height:"inherit",padding:"10px 5px"}}>
          <EditIcon sx={{color:"#000",width:"auto",height:20}}/>
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth

          >
            <DialogTitle sx={{paddingBottom:0}} id="alert-dialog-title">
             Edit
            </DialogTitle>
            <DialogContent  sx={{
                minHeight:"15rem !important"
            }}>
            <Box sx={{ width: '100%',minWidth:"25rem" }}>
                <EditProgramModule refetch={refetch} setOpen={setOpen} moduleProb={moduleProp} progress={moduleProp.progress} completion={moduleProp.completedSections}/>
    </Box>

            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
}