import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AddOutlined, Edit } from '@mui/icons-material';
import ReactSelect from 'react-select';

export default function AddScheduling(probs) {
  const [open, setOpen] = React.useState(false);
  let {initialValues,edit,modules,classes,disabled,study}=probs;
  const [selectedModule,setSelectedModule]=React.useState(edit ? initialValues["moduleId"] ||'':""); //editing parameters to ignore just set edit to false
  const [selectedClass,setSelectedClass]=React.useState(edit ? initialValues["classroomId"] ||'':"");
  const [selectedType,setSelectedType]=React.useState(edit ? initialValues["type"] ||'':"");
  const [selectedStartingTime,setSelectedStartingTime]=React.useState(edit ? {value:initialValues["startingTime"],label:initialValues["startingTime"]} ||'':"");
  const [selectedEndingTime,setSelectedEndingTime]=React.useState(edit ? {value:initialValues["endingTime"],label:initialValues["endingTime"]} ||'':"");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleChange = (event) => {
    console.log(event.target.value,event);
    if(event.target.name === "module")
    setSelectedModule(event.target.value)
  else if(event.target.name === "class")
  setSelectedClass(event.target.value)
  else if(event.target.name === "type")
  setSelectedType(event.target.value) 
 };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button disabled={disabled} startIcon={edit? "":<AddOutlined/>} variant={edit ? "contained" : "outlined"}  sx={edit ?{'&:hover':{bgcolor:"transparent",border:"none",color:"inherit",boxShadow:"none"},bgcolor:"transparent",boxShadow:"none",padding:"0",minWidth:"fit-content",color:"inherit",border:"none"}:{}} title='Add a Schedule' onClick={handleClickOpen}>
        {edit ? "Edit":"Add"}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const {program,establishNo,
            establishDate,
            checkEDate,
            checkENO,
            notes} = formJson;
            handleClose();
          },
        }}
        fullWidth={true}
        
      >
        <DialogTitle>Add a Committe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the committe information below
          </DialogContentText>
          <FormControl sx={{minWidth:"100%",paddingLeft:"0",margin:"8px 0 4px "}} size="small" >
          <InputLabel id="module" sx={{color:"var(--styling1) !important"}}>Module</InputLabel>
          <Select
          name="module"
          label="Module"
          labelId="module"
          onChange={handleChange}
          fullWidth
          value={selectedModule}
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
            {modules.map((mod)=> <MenuItem value={mod.id}>{mod.name}</MenuItem>)}
        </Select>
        </FormControl>
        <FormControl sx={{minWidth:"100%",paddingLeft:"0",margin:"8px 0 4px "}} size="small" >
          <InputLabel id="class" sx={{color:"var(--styling1) !important"}}>Class</InputLabel>
          <Select
          name="class"
          label="Class"
          labelId="class"
          onChange={handleChange}
          fullWidth
          value={selectedClass}
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
            {classes.map((cl)=> <MenuItem value={cl.id} key={cl.id}>{cl.name}</MenuItem>)}
            <MenuItem value="online">Online</MenuItem>
        </Select>
        </FormControl>
        <FormControl sx={{minWidth:"100%",paddingLeft:"0",margin:"8px 0 4px "}} size="small" >
          <InputLabel id="type" sx={{color:"var(--styling1) !important"}}>Type</InputLabel>
          <Select
          name="type"
          label="Type"
          labelId="type"
          onChange={handleChange}
          fullWidth
          value={selectedType}
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
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Lab">Lab</MenuItem>
            <MenuItem value="Inside Classroom">Inside Classroom</MenuItem>
        </Select>
        </FormControl>
        <Box sx={{display:"grid",gridTemplateColumns:"1fr 1fr",width:"100%"}}>
        <ReactSelect 
        hideSelectedOptions
        value={selectedStartingTime}
        onChange={(e)=>{setSelectedStartingTime(e)}}
        options={study === "morning"? generateTimeArrayInRange(480,900,5):generateTimeArrayInRange(720,1170,5)}
        placeholder="Starting Time"
        ></ReactSelect>
        <ReactSelect 
        hideSelectedOptions
        value={selectedEndingTime}
        onChange={(e)=>setSelectedEndingTime(e)}
        options={study === "morning"? generateTimeArrayInRange(480,900,5):generateTimeArrayInRange(720,1170,5)}
        placeholder="Ending Time"
        ></ReactSelect></Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{edit? "Save":"Add"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function generateTimeArrayInRange(startValue,endValue,stepSize){
  const timeArray = [];
// Using a for loop to generate the array
for (let value = startValue; value <= endValue; value += stepSize) {
  // Calculating hours and minutes
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  // Formatting the time as "00:00"
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  // Adding the formatted time to the array
  timeArray.push({label:formattedTime,value:hours*100+minutes,id:formattedTime});
}
return timeArray;
}