import { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, List, ListItem, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { Grade, Person2Outlined } from "@mui/icons-material";
import { useQueries, useQuery } from "react-query";
import { get_module_students, get_students_grade,get_students_Attendance_byModule } from "../../../../store/getandset";
import { useSelector } from "react-redux";
import { TableLoader } from "../../DepartmentProfile/Programs/ProgramModules/ProgramModulesTable";
export default function StudentsAttendance(probs) {
    let {grades,moduleName,module}=probs;
    const [open, setOpen] = useState(false);
    const [value,setValue]=useState("1");
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
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
    const promise3=()=> get_students_Attendance_byModule(module.id);
    const {
      data: attendances = [],
      isLoading:isLoading3,
      isError:error3,
    isFetching:isFetching3, 
    refetch:refetch3 
    } = useQuery(`module:${module.id}`, promise3, {
     enabled: ((!!Department_id) && (module.id !== "")), 
      refetchOnWindowFocus:false,
    
      select:(data)=>{
        
          return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
          
      }
    }
    );
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
          <Button startIcon={<Person2Outlined/>}  variant="outlined" onClick={handleClickOpen} sx={{width:"48%"}}>
            Attendance
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
              {moduleName} Attendance
            </DialogTitle>
            <DialogContent  sx={{
                minHeight:"15rem !important"
            }}>
            <Box sx={{ width: '100%',minWidth:"25rem" }}>
                <AttendanceTable loading={isLoading3 || isLoadingStudents} students={students} attendances={attendances} module={module}/>
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


export function AttendanceTable(probs) {
  const {students,attendances,module,loading}=probs;
  console.log(attendances,students);
  const selectedAttendance = attendances.reduce((accumulator, currentValue) => {
    // Check if the lecture already exists in the accumulator
    const existingLecture = accumulator.find(item => (item.D === currentValue.D && item.M === currentValue.M));
    if (!existingLecture) {
        // If the lecture doesn't exist, add the current attendance object to the accumulator
        accumulator.push(currentValue);
    }
    return accumulator;
}, []);
let numOfHours=0;
selectedAttendance.map((s)=>{
  numOfHours+=s.fullhours;
})
    let rows= students.map((s)=>({...s,name:s.firstname+" "+s.lastname}));
   console.log(rows);
   console.log(attendances,"att");
   rows=rows.map((row)=>{
if (attendances===0) {
  return {...row}
}
    const StudentsAttendance=attendances.filter((attendance)=>row.id===attendance.studentId);
    let attendedHours=0,absentHours=0,failed=false;
    StudentsAttendance.map((st)=>{
      if(st.attended){
        attendedHours+=st.attendedHours;
      }
      else{
        absentHours+=st.fullhours;
      }
    });
    if(absentHours >= (0.14*(module.ECTS * 25))){
      failed=true;
    }
      return{...row,attendedHours:attendedHours,absentHours:absentHours,failed:failed,

      }
   });
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
    field: 'attendedHours',
    headerName: `Attended Hours/${numOfHours}`,
    width: 200,
  },
  {
    field: 'absentHours',
    headerName: 'Absense Hours',
    width: 200,
  },
  {
    field: 'failed',
    headerName: 'Failed by Attendance',
    type:"boolean",
    width: 200,
  },
];
  return (
    <Box sx={{ height: 400, width: '100%' }}>
     {loading?<TableLoader/>: <DataGrid 
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
      />
}
    </Box>
  );
}