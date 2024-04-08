import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridNoRowsOverlay } from '@mui/x-data-grid';
import { AddOutlined, Edit } from '@mui/icons-material';
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
]
const data = [
    { id: 1, name: 'Snow', attendedHours: 3,attended:true },
    { id: 2, name: 'Fray', attendedHours: 0,attended:false },
  ];
export default function AddStudentsDivision(probs) {
  const [open, setOpen] = React.useState(false);
  const [selectedStudents, setSelectedStudents] = React.useState([]);
  let {division,students,edit=false}=probs;
  const [divisionStudents,setDivisionStudents]=React.useState(data);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  function addStudentHandler(){
  console.log(selectedStudents);
  }
  return (
    <React.Fragment>
      <Button startIcon={edit? <Edit/>:<AddOutlined/>} variant={edit ? "contained" : "outlined"}  sx={edit ?{'&:hover':{bgcolor:"#a2d0fb !important",border:"none"},bgcolor:"#add5fb !important",width:"8rem",boxShadow:"none",color:"#fff",border:"none"}:{width:"15rem",marginTop:"0.8rem"}} title='Edit division students' onClick={handleClickOpen}>
        Add Division Students
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleClose();
          },
        }}
        fullWidth
      >
        <DialogTitle>Add division Students</DialogTitle>
        <DialogContent>
          <DialogContentText>
            select students to add to the division
          </DialogContentText>
          <Box sx={{ height: "400px", bgcolor:"#fff",width: '100%',maxWidth:"100%",overflow:"auto",marginTop:"0.7rem" }}>
          <DataGrid 

             rows={divisionStudents}
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
        <Typography textAlign="center" variant='subtitle1' marginY={1} color="text.secondary">No Students were found!</Typography>)
    }}
    pageSizeOptions={[5]}
    rowSelection={true}
    checkboxSelection
    onRowSelectionModelChange={(id)=>{setSelectedStudents(id)}}
  />
  </Box>
  <Button variant='outlined' sx={{marginTop:"0.8rem"}} disabled={selectedStudents.length === 0} onClick={addStudentHandler}>Add Students</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{edit? "Save":"Add"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}