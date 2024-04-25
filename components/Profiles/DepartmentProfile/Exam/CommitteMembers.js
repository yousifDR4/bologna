import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, Typography } from '@mui/material';
import { AddOutlined, DeleteOutline, Edit } from '@mui/icons-material';
import Confirm from '../../../UI/Confirm/Confirm';
const fields=[   
"establishNo",
"establishDate",
"checkEDate",
"checkENO",
"notes"]
export default function CommitteMembers(probs) {
  let {program,initialValues,edit,professors,semester}=probs;
  const [changeRecord,setChangeRecord]=React.useState(false);
  const [openconfirm,setOpenConfirm]=React.useState(false);
  const [id,setId]=React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [checkingCommitte,setCheckingComitte]=React.useState([]);
  const [examComitte,setExamComitte]=React.useState([]);
  const [value, setValue] = React.useState('1');
  React.useEffect(()=>{
    const initialCheckValuesIWithId=initialValues["checkingCommitte"]?initialValues["checkingCommitte"].length > 0 ? initialValues["checkingCommitte"].map((m)=>{ let currId=id;setId(prev=>{currId=prev;return prev+1});return {id:m.id,name:m.name,level:m.level,memberId:currId}; }):initialValues["checkingCommitte"]:[];
    const initialExamValuesIWithId=initialValues["examCommitte"]?initialValues["examCommitte"].length > 0 ? initialValues["examCommitte"].map((m)=>{ let currId=id;setId(prev=>{currId=prev;return prev+1});return {id:m.id,name:m.name,level:m.level,memberId:currId}; }):initialValues["examCommitte"]:[];
    console.log(initialExamValuesIWithId);
    console.log(initialCheckValuesIWithId);
    setCheckingComitte(initialCheckValuesIWithId);
    setExamComitte(initialExamValuesIWithId);
  },[]);
  const handleResult=(result)=>{
    if(result){
      handleClose();
    }
    else{
      return;
    }
  }
  const handleCancel=()=>{
    if(changeRecord){
      setOpenConfirm(true);
    }
    else{
      handleClose();
    }
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    const initialCheckValuesIWithId=initialValues["checkingCommitte"]?initialValues["checkingCommitte"].length > 0 ? initialValues["checkingCommitte"].map((m)=>{ let currId=id;setId(prev=>{currId=prev;return prev+1});return {id:m.id,name:m.name,level:m.level,memberId:currId}; }):initialValues["checkingCommitte"]:[];
    const initialExamValuesIWithId=initialValues["examCommitte"]?initialValues["examCommitte"].length > 0 ? initialValues["examCommitte"].map((m)=>{ let currId=id;setId(prev=>{currId=prev;return prev+1});return {id:m.id,name:m.name,level:m.level,memberId:currId}; }):initialValues["examCommitte"]:[];
    console.log(initialExamValuesIWithId);
    console.log(initialCheckValuesIWithId);
    setCheckingComitte(initialCheckValuesIWithId);
    setExamComitte(initialExamValuesIWithId);
    setChangeRecord(false);
  };
  const addHandler=(committe)=>{
    if(committe === "checkingCommitte"){
      setCheckingComitte((prev)=>{
        return [...prev,{id:"",level:"",memberId:id},];
      })
    }
    else{
      setExamComitte((prev)=>{
        return [...prev,{id:"",level:"",memberId:id},];
      })
    }
    setChangeRecord(true);
    setId(prev=>++prev);
  }
  console.log(checkingCommitte);
  console.log(examComitte);
  return (
    <React.Fragment>
      <Confirm message="All of your unsaved progress will be dismissed!" title="Confirm Exit?" handleResult={handleResult} open={openconfirm} setOpen={setOpenConfirm} />
      <Button  variant={edit ? "contained" : "outlined"}  sx={edit ?{'&:hover':{bgcolor:"#a2d0fb !important",border:"none"},bgcolor:"#add5fb !important",boxShadow:"none",color:"#fff",border:"none"}:{}} title='Add an Committe' onClick={handleClickOpen}>
        Comitte Members
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
            //semester 
            handleClose();
          
          },
        }}
        fullWidth={true}
      >
        <DialogTitle>Committe Members</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the committe members information below
          </DialogContentText>
          <Box sx={{ width: '100%',minWidth:"25rem" }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Exam Committe" value="1" key="1"/>
          <Tab label="Checking Committe" value="2" key="2"/>
        </Tabs>
      </Box>
      {(value === "1") && <FormControl value={value} index={0} sx={{width:"100%"}}>
        <Box sx={{width:"100%",display:"flex",flexDirection:"row",padding:"0.8rem 0.4rem",bgcolor:"#F1F1F3",color:"#a3a8ad"}}>
        <Typography sx={{width:"50%"}}>Professor</Typography>
        <Typography sx={{width:"50%"}}>Level</Typography>
        </Box>
        { examComitte.map((committe,outerIndex)=>(
          <CustomTab initialValues={committe} program={program} professors={professors} key={outerIndex}  setCommittee={setExamComitte}></CustomTab>
        ))}
      
        <Button startIcon={<AddOutlined/>} variant='outlined' onClick={()=>addHandler("examCommitte")} sx={{width:"100%"}}>Add Committe Member</Button>
      </FormControl>}
    {(value === "2" ) && <FormControl value={value} index={1} sx={{width:"100%"}}>
    <Box sx={{width:"100%",display:"flex",flexDirection:"row",padding:"0.8rem 0.4rem",bgcolor:"#F1F1F3",color:"#a3a8ad"}}>
        <Typography sx={{width:"50%"}}>Professor</Typography>
        <Typography sx={{width:"50%"}}>Level</Typography>
        </Box>
      { checkingCommitte.map((committe,outerIndex)=>(
          <CustomTab initialValues={committe} program={program} professors={professors} key={outerIndex} setCommittee={setCheckingComitte}/>
        ))
        }
        <Button startIcon={<AddOutlined/>} variant='outlined' onClick={()=>addHandler("checkingCommitte")} sx={{width:"100%"}}>Add Committe Member</Button>
      </FormControl>}
      </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit">{edit? "Save":"Add"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
const CustomTab=(probs)=>{
  let {program,initialValues,professors,onCommitteeChange,setCommittee}=probs;
  const [selectedProfessor,setSelectedProfessor]=React.useState(initialValues["id"]);
  const [selectedYear,setSelectedYear]=React.useState(initialValues["level"]);
  const handleProffessorChange = (event) => {
    const newProfessorId = event.target.value;
    setSelectedProfessor(newProfessorId);
    // Update the corresponding committee object in the parent component
    setCommittee((prev)=>{
      const updatedCommittees = prev.map((committe) =>
      initialValues.memberId === committe.memberId ? {memberId:initialValues.memberId,id:newProfessorId,level:initialValues.level} : committe
    );
    return updatedCommittees;
    })
  };
  const deleteHandler=()=>{
 setCommittee((prev)=>{
  return prev.filter((c)=>c.memberId!= initialValues.memberId);
 })
  }
  const handleLevelChange=(event)=>{
    const newLevel = event.target.value;
  setSelectedYear(newLevel);
    // Update the corresponding committee object in the parent component
    setCommittee((prev)=>{
      const updatedCommittees = prev.map((committe) =>
      initialValues.memberId === committe.memberId ? {memberId:initialValues.memberId,id:initialValues.id,level:newLevel} : committe
    );
    return updatedCommittees;
    })  }
  return(
    <Box sx={{width:"100%",display:"flex",flexDirection:"row"}}>
       <FormControl sx={{width:"45%",paddingLeft:"0",margin:"8px 0 4px "}} size="small" >
          <InputLabel id="proffessor" sx={{color:"var(--styling1) !important"}}>Proffessor</InputLabel>
          <Select
          id="proffessor"
          label="Proffessor"
          labelId="professor"
          onChange={handleProffessorChange}
          fullWidth
          value={initialValues["id"]}
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
          <MenuItem value="83837373">mohammed</MenuItem>
            {professors.map((pro)=> <MenuItem value={pro.id}>{pro.name}</MenuItem>)}
        </Select>
        </FormControl>
        <FormControl sx={{minWidth:"45%",paddingLeft:"0",margin:"8px 0 4px "}} size="small" >
          <InputLabel id="level" sx={{color:"var(--styling1) !important"}}>Level</InputLabel>
          <Select
          id="level"
          label="Level"
          labelId="level"
          onChange={handleLevelChange}
          fullWidth
          value={initialValues["level"]}
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
         {typeof program["type"] === 'number' &&
  [...Array(program["type"])].map((_, index) => (
    <MenuItem key={index} value={index+1}>{index+1}</MenuItem>
  ))
}
        </Select>
        </FormControl>
        <Button endIcon={<DeleteOutline/>} onClick={deleteHandler} sx={{width:"10%",'&:hover':{border:"none",color:"red"}}}></Button>
    </Box>
  )
}