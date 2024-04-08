import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AddOutlined, Edit } from '@mui/icons-material';
export default function AddDivision(probs) {
  const [open, setOpen] = React.useState(false);
  let {level,studyType,program,initialValues=[],edit=false}=probs;
  const [divisionName,setDivisionName]=React.useState(edit ? initialValues['name'] ||'':"");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button startIcon={edit? <Edit/>:<AddOutlined/>} variant={edit ? "contained" : "outlined"}  sx={edit ?{'&:hover':{bgcolor:"#a2d0fb !important",border:"none"},bgcolor:"#add5fb !important",width:"50%",boxShadow:"none",color:"#fff",border:"none"}:{}} title='Add an Exam' onClick={handleClickOpen}>
        {edit ? "Edit":"Add a division"}
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
      >
        <DialogTitle>{!edit ? "Add a division":"edit division "+ divisionName }</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the division information below
          </DialogContentText>
          <FormControl sx={{minWidth:"100%",paddingLeft:"0",margin:"8px 0 4px "}} size="small" >
          <TextField  id="divison"
          label="Division Name"
           value={divisionName} 
           onChange={(e)=>setDivisionName(e.target.value)}></TextField>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{edit? "Save":"Add"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}