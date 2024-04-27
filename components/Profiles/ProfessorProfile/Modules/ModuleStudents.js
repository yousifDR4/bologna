import { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, List, ListItem, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { Grade, GroupOutlined } from "@mui/icons-material";
import { useQueries, useQuery } from "react-query";
import { get_module_students, get_students_grade } from "../../../../store/getandset";
import { useSelector } from "react-redux";
import { TableLoader } from "../../DepartmentProfile/Programs/ProgramModules/ProgramModulesTable";
export default function ModuleStudents(probs) {
    let {moduleName,module}=probs;
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    console.log(module);
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
      const studentPromise=()=>get_module_students(Department_id,module.id);
      const {
        data: students=[],
        isLoading:isLoadingStudents,
        error:iserror,
      isFetching:isFetching, 
       refetch
      } = useQuery(`department:${Department_id}module:${module.id}`, studentPromise, {
       enabled:(!!Department_id && open ),
        refetchOnWindowFocus:false,
      
        select:(data)=>{
            return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
        }
      }
      );

    return (
        <>
          <Button startIcon={<GroupOutlined/>}  variant="outlined" onClick={handleClickOpen} sx={{width:"48%"}}>
            Students
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth
           
          >
            <DialogTitle id="alert-dialog-title">
              {moduleName} Students
            </DialogTitle>
            <DialogContent  sx={{
                minHeight:"15rem !important"
            }}>
            <Box sx={{ width: '100%',minWidth:"25rem" }}>
                <StudentsTable students={students} isLoading={isLoadingStudents}/>
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


const columns = [
    {
        field: 'id',
        headerName: 'Student ID',
        width: 200,
      },
  {
    field: 'name',
    headerName: 'Student Name',
    width: 200,

  },
  {
    field: 'level',
    headerName: 'Student Level',
    width: 200,
  },
  {
    field: 'Division',
    headerName: 'Student Division',
    width: 200,
  },
 
];

const rows = [
{id:"01",name:"ahmed",level:2}
];

export function StudentsTable(probs) {
  const {students,isLoading}=probs;
    let studentrows=students.map((s)=>{return {...s,name:s.firstname + " " + s.lastname}})
    const [Students,setStudents]=useState(rows);
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      {isLoading? <TableLoader/>:
      <DataGrid 
      sx={{ height: "400", bgcolor:"#fff",width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}
        rows={studentrows}
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
      />
}
    </Box>
  );
}