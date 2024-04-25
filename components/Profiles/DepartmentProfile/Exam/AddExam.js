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
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../store/fire';
import { useDispatch, useSelector } from 'react-redux';
import { displayMessage } from '../../../../store/message-slice';
export default function AddExam(probs) {
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const [open, setOpen] = React.useState(false);
  let {modules,committes,program,initialValues,edit,refetch}=probs;
  const [selectedCommitte,setSelectedCommitte]=React.useState(edit ? initialValues['committe'] ||'':"");
  const [selectedLevel,setSelectedLevel]=React.useState(edit ? initialValues['level'] ||'':"");
  const [selectedModule,setSelectedModule]=React.useState(edit ? initialValues['module'] ||'':"");
  const [selectedTry,setSelectedTry]=React.useState(edit ? initialValues['try'] ||'':"");
  const [uploading, setuploading] = React.useState(false);
  const dispatch=useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleChange = (event) => {
    setSelectedCommitte(event.target.value);
  };
  const handleClose = () => {
    setOpen(false);
  };
console.log(probs);
console.log(modules);
  return (
    <React.Fragment>
      <Button startIcon={edit? <Edit/>:<AddOutlined/>} variant={edit ? "contained" : "outlined"}  sx={edit ?{'&:hover':{bgcolor:"#a2d0fb !important",border:"none"},bgcolor:"#add5fb !important",width:"50%",boxShadow:"none",color:"#fff",border:"none"}:{}} title='Add an Exam' onClick={handleClickOpen}>
        {edit ? "Edit":"Add an Exam"}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async(event) => {
            setuploading(true);
            try{
            event.preventDefault();
            const info = {
              committe: selectedCommitte,
              level:selectedLevel,
              try:selectedTry,
              module:selectedModule,
              Deprartment_id:Department_id,
              program:program.id
            };
            const ref=await addDoc(collection(db,"Exams"),info)
            refetch();
            dispatch(displayMessage("Exam was Added Successfully","success"))
            handleClose();
          }
          catch(e){
            console.log(e);
            dispatch(displayMessage("An Error Occurred","error"))
          }
          finally{
            setuploading(false);
          }
          },
        }}
      >
        <DialogTitle>Add an Exam</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the exam information below
          </DialogContentText>
          <FormControl sx={{minWidth:"100%",paddingLeft:"0",margin:"8px 0 4px "}} size="small" >
          <InputLabel id="committe" sx={{color:"var(--styling1) !important"}}>Exam Committe</InputLabel>
          <Select
          id="committe"
          label="Committe"
          labelId="committe"
          onChange={handleChange}
          fullWidth
          value={selectedCommitte}
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
            {committes.map((c)=> <MenuItem value={c.id}>{c.establishNo}</MenuItem>)}
        </Select>
        </FormControl>
        <FormControl sx={{minWidth:"100%",paddingLeft:"0",margin:"8px 0 4px "}} size="small" >
          <InputLabel id="level" sx={{color:"var(--styling1) !important"}}>Level</InputLabel>
          <Select
          id="level"
          label="Level"
          labelId="level"
          onChange={(e)=>setSelectedLevel(e.target.value)}
          fullWidth
          value={selectedLevel}
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
         {  program?.type && [...Array(program.type)].map((_, index) => (
    <MenuItem key={index} value={index+1}>{index+1}</MenuItem>
  ))}
        </Select>
        </FormControl>
        <FormControl sx={{minWidth:"100%",paddingLeft:"0",margin:"8px 0 4px "}} size="small" >
          <InputLabel id="module" sx={{color:"var(--styling1) !important"}}>Module</InputLabel>
          <Select
          id="module"
          label="Module"
          labelId="module"
          onChange={(e)=>setSelectedModule(e.target.value)}
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
            {modules.filter((mod)=>mod?.level === selectedLevel).map((fmod)=><MenuItem value={fmod?.id}>{fmod?.name}</MenuItem>)}
        </Select>
        </FormControl>
        <FormControl sx={{minWidth:"100%",paddingLeft:"0",margin:"8px 0 4px "}} size="small" >
          <InputLabel id="try" sx={{color:"var(--styling1) !important"}}>Try</InputLabel>
          <Select
          id="try"
          label="Try"
          labelId="try"
          onChange={(e)=>setSelectedTry(e.target.value)}
          fullWidth
          value={selectedTry}
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
          <MenuItem value={1}>First Try</MenuItem>
          <MenuItem value={2}>Second Try</MenuItem>
        </Select>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={uploading} >{uploading ? "Uploading..." :edit? "Save":"Add"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}