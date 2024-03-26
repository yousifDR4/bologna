import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AddOutlined, Edit, Upload } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { db } from '../../../../store/fire';
import { addDoc, collection } from 'firebase/firestore';
const fields=[   
"establishNo",
"establishDate",
"checkEDate",
"checkENO",
"notes"]

export default function AddCommitte(probs) {
  const [open, setOpen] = React.useState(false);
  let {programs,initialValues,edit,semester,refetch}=probs;
  console.log(edit ? initialValues['program']['id'] ||'':"");
  const [uplauding, setUplauding] = React.useState(false);
  const [selectedProgram,setSelectedProgram]=React.useState(edit ? initialValues['program'] ||'':"");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleChange = (event) => {
    setSelectedProgram(event.target.value)
  };
  const handleClose = () => {
    setOpen(false);
  };
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;

  return (
    <React.Fragment>
      <Button startIcon={edit? <Edit/>:<AddOutlined/>} variant={edit ? "contained" : "outlined"}  sx={edit ?{'&:hover':{bgcolor:"#a2d0fb !important",border:"none"},bgcolor:"#add5fb !important",width:"50%",boxShadow:"none",color:"#fff",border:"none"}:{}} title='Add an Committe' onClick={handleClickOpen}>
        {edit ? "Edit":"Add a Committe"}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async(event) => {
            event.preventDefault();
            setUplauding(true);
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
           const x = formJson;
            const filteredObject = Object.entries(x).reduce(
              (acc, [key, value]) => {
                if (value !== "") {
                  acc[key] = value;
                }
                return acc;
              },
              {}
            );
            const id = await addDoc(collection(db, "Committe"), {
              ...x[0],
              ...filteredObject,
              Department_id: Department_id,
              program: selectedProgram,
              semester:semester,
             
            });
            setUplauding(false);
            refetch();
            handleClose();
          },
        }}
      >
        <DialogTitle>Add a Committe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the committe information below
          </DialogContentText>
          <FormControl sx={{minWidth:"100%",paddingLeft:"0",margin:"8px 0 4px "}} size="small" >
          <InputLabel id="program" sx={{color:"var(--styling1) !important"}}>Program</InputLabel>
          <Select
          id="program"
          label="Program"
          labelId="program"
          onChange={handleChange}
          fullWidth
          value={selectedProgram}
           sx={{
        height: '2.5rem',
        color: 'var(--styling1)',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--styling1) !important'
        },
        '& .MuiSvgIcon-root': {
            color: 'var(--styling1)'
        }
    }}
        >
            {programs.map((prog)=> <MenuItem value={prog.id}>{prog.name}</MenuItem>)}
        </Select>
        </FormControl>
        {fields.map((field)=>
           <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name={field}
            label={field.toLocaleUpperCase()}
            type="text"
            fullWidth
            variant="standard"
            defaultValue={edit ? initialValues[field] || '':""} 
          />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={uplauding} type="submit" startIcon={uplauding ? <Upload/>:""}>{uplauding ? "Uploading":edit? "Save":"Add"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}