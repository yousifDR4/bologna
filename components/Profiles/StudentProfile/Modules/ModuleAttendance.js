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
export default function StudentsAttendance(probs) {
    let {grades,moduleName,module}=probs;
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
                <AttendanceTable/>
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
    field: 'attendedHours',
    headerName: 'Attended Hours',
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

const rows = [
{id:"01",name:"ahmed",midterm:5,labs:0,project:4,onsightAssignments:6,reports:3,failed:false}
];

export function AttendanceTable(probs) {
    const [attendance,setAttendance]=useState(rows);
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid 
      sx={{ height: "400", bgcolor:"#fff",width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}
        rows={attendance}
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
    </Box>
  );
}