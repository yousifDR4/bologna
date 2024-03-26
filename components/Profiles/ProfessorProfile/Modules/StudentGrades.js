import { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, List, ListItem, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { Grade } from "@mui/icons-material";
export default function StudentGrades(probs) {
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
          <Button startIcon={<Grade/>}  variant="outlined" onClick={handleClickOpen} sx={{width:"48%"}}>
            Grades
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
              {moduleName} Grades
            </DialogTitle>
            <DialogContent  sx={{
                minHeight:"15rem !important"
            }}>
            <Box sx={{ width: '100%',minWidth:"25rem" }}>
                <GradesTable/>
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
    field: 'name',
    headerName: 'Student Name',
    width: 200,
  },
  {
    field: 'Division',
    headerName: 'Student Division',
    width: 150,
  },
  {
    field: 'midterm',
    headerName: 'Midterm',
    width: 130,
  },
  {
    field: 'labs',
    headerName: 'Labs',
    width: 130,
  },
  {
    field: 'onlineAssignments',
    headerName: 'Online Assignments',
    width: 130,
  },
  {
    field: 'project',
    headerName: 'Project',
    width: 130,
  },
  {
    field: 'onsightAssignments',
    headerName: 'Onsight Assignments',
    width: 130,
  },
  {
    field: 'reports',
    headerName: 'Reports',
    width: 130,
  },
  {
    field: 'totalGrade',
    headerName: 'Total Grade',
    width: 130,
    valueGetter: (params) =>
    (+params.row.midterm || 0) + (+params.row.labs || 0) + (+params.row.onlineAssignments || 0) + (+params.row.project || 0 ) + (+params.row.onsightAssignments || 0 ) + (+params.row.reports || 0 ),
  },
];

const rows = [
{id:"01",name:"ahmed",midterm:5,labs:0,project:4,onsightAssignments:6,reports:3}
];

export function GradesTable(probs) {
    const [Grades,setGrades]=useState(rows);
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid 
      sx={{ height: "400", bgcolor:"#fff",width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}
        rows={Grades}
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