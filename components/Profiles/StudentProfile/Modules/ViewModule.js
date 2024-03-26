import { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, List, ListItem, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { stringifyNumber } from "../../DepartmentProfile/LevelModule";
import { Info } from "@mui/icons-material";
let initialValue={
    program:"",
    module:"",
    ECTS:0,
    level:0,
    manager:"",
    revisor:"",
    acceptanceDate:"",
    lab:"",
    theory:"",
    online:"",
    exercises:"",
    week1T:"",
    week2T:"",
    week3T:"",
    week4T:"",
    week5T:"",
    week6T:"",
    week7T:"",
    week8T:"",
    week9T:"",
    week10T:"",
    week11T:"",
    week12T:"",
    week13T:"",
    week14T:"",
    week15T:"",
    week1L:"",
    week2L:"",
    week3L:"",
    week4L:"",
    week5L:"",
    week6L:"",
    week7L:"",
    week8L:"",
    week9L:"",
    week10L:"",
    week11L:"",
    week12L:"",
    week13L:"",
    week14L:"",
    week15L:"",
    structHoursCR:{noWeeks:"",noHours:"",totalHours:""},
    structHoursON:{noWeeks:"",noHours:"",totalHours:""},
    structHoursSC:{noWeeks:"",noHours:"",totalHours:""},
    structHoursLB:{noWeeks:"",noHours:"",totalHours:""},
    structHoursPR:{noWeeks:"",noHours:"",totalHours:""},
    structHoursCL:{noWeeks:"",noHours:"",totalHours:""},
    unStructHours:{},
    AssesmentLab:{activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
    AssesmentProject:{activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
    AssesmentQuizes:{activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
    AssesmentOnline:{activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
    AssesmentOnsight:{activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
    AssesmentReports:{activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
    books:[],
    onlineSources:""
    
}
function ViewModule(probs) {
    let {moduleProb,name}=probs;
    const [open, setOpen] = useState(false);

    let initialValue={
        program: moduleProb.program || "",
    module: moduleProb.module || "",
    ECTS: moduleProb.ECTS || "",
    level: moduleProb.level || "",
    manager: moduleProb.manager || "",
    revisor: moduleProb.revisor || "",
    acceptanceDate: moduleProb.acceptanceDate || "",
    lab: moduleProb.lab || "",
    theory: moduleProb.theory || "",
    online: moduleProb.online || "",
    exercises: moduleProb.exercises || "",
    week1T: moduleProb.week1T || "",
    week2T: moduleProb.week2T || "",
    week3T: moduleProb.week3T || "",
    week4T: moduleProb.week4T || "",
    week5T: moduleProb.week5T || "",
    week6T: moduleProb.week6T || "",
    week7T: moduleProb.week7T || "",
    week8T: moduleProb.week8T || "",
    week9T: moduleProb.week9T || "",
    week10T: moduleProb.week10T || "",
    week11T: moduleProb.week11T || "",
    week12T: moduleProb.week12T || "",
    week13T: moduleProb.week13T || "",
    week14T: moduleProb.week14T || "",
    week15T: moduleProb.week15T || "",
    week1L: moduleProb.week1L || "",
    week2L: moduleProb.week2L || "",
    week3L: moduleProb.week3L || "",
    week4L: moduleProb.week4L || "",
    week5L: moduleProb.week5L || "",
    week6L: moduleProb.week6L || "",
    week7L: moduleProb.week7L || "",
    week8L: moduleProb.week8L || "",
    week9L: moduleProb.week9L || "",
    week10L: moduleProb.week10L || "",
    week11L: moduleProb.week11L || "",
    week12L: moduleProb.week12L || "",
    week13L: moduleProb.week13L || "",
    week14L: moduleProb.week14L || "",
    week15L: moduleProb.week15L || "",
        structHoursCR:moduleProb.structHoursCR || {noWeeks:"",noHours:"",totalHours:""},
        structHoursON:moduleProb.structHoursON || {noWeeks:"",noHours:"",totalHours:""},
        structHoursSC:moduleProb.structHoursSC || {noWeeks:"",noHours:"",totalHours:""},
        structHoursLB:moduleProb.structHoursLB || {noWeeks:"",noHours:"",totalHours:""},
        structHoursPR:moduleProb.structHoursPR || {noWeeks:"",noHours:"",totalHours:""},
        structHoursCL:moduleProb.structHoursCL ||{noWeeks:"",noHours:"",totalHours:""},
        unStructHours:moduleProb.unStructHours || {},
        AssesmentLab:moduleProb.AssesmentLab || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        AssesmentProject:moduleProb.AssesmentProject || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        AssesmentQuizes:moduleProb.AssesmentQuizes || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        AssesmentOnline:moduleProb.AssesmentOnline || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        AssesmentOnsight: moduleProb.AssesmentOnsight || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        AssesmentReports:moduleProb.AssesmentReports || {activated:false,noTimes:"",degreePerTime:"",noWeeks:[]},
        books:moduleProb.books || [],
        onlineSources:moduleProb.onlineSources || ""
    }
    const [module,setModule]=useState(initialValue);
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
          <Button sx={{width:"48%"}} startIcon={<Info/>} variant="outlined" onClick={handleClickOpen}>
            Details
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
              {name}
            </DialogTitle>
            <DialogContent  sx={{
                minHeight:"15rem !important"
            }}>
            <Box sx={{ width: '100%',minWidth:"25rem" }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider',overflow:"auto" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{minWidth:"70rem"}}>
          <Tab label="Module Info" value="1" key="1"/>
          <Tab label="Module Theory" value="2" key="2"/>
          <Tab label="Module Lab" value="3" key="3"/>
          <Tab label="Module Assesments" value="4" key="4"/>
          <Tab label="Module SSH" value="5" key="5"/>
          <Tab label="Module USSH" value="6" key="6"/>
          <Tab label="Module Sources" value="7" key="7"/>
          
        </Tabs>
      </Box>
      {(value === "1") && <ModuleInfo moduleProb={module}  />}
    {(value === "2" ) && <ModuleTheory moduleProb={module}  />}
    {(value === "3" ) && <ModuleLab moduleProb={module}  />}
    {(value === "4" ) && <ModuleTheory moduleProb={module}  />}
    {(value === "5" ) && <ModuleSSH moduleProb={module}  />}
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

export default ViewModule;

const ModuleInfo=(probs)=>{
    let {moduleProb}=probs;
    console.log(moduleProb);
    let initialValue={
        program: moduleProb.program || "",
    module: moduleProb.module || "",
    ECTS: moduleProb.ECTS || "",
    level: moduleProb.level || "",
    manager: moduleProb.manager || "",
    revisor: moduleProb.revisor || "",
    acceptanceDate: moduleProb.acceptanceDate || "",
    lab: moduleProb.lab || "",
    theory: moduleProb.theory || "",
    online: moduleProb.online || "",
    exercises: moduleProb.exercises || "",
    }
    return(
        <List sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
            {Object.entries(initialValue).map(([key, value]) => (
        <ListItem key={key} sx={{width:"30%",minWidth:"200px"}}>
            <ListItemText primary={key} secondary={value}/>
        </ListItem>
      ))}
        </List>
    )
}
const ModuleTheory=(probs)=>{
    let {moduleProb}=probs;
    console.log(moduleProb);
    let initialValue={
        week1T: moduleProb.week1T || "",
        week2T: moduleProb.week2T || "",
        week3T: moduleProb.week3T || "",
        week4T: moduleProb.week4T || "",
        week5T: moduleProb.week5T || "",
        week6T: moduleProb.week6T || "",
        week7T: moduleProb.week7T || "",
        week8T: moduleProb.week8T || "",
        week9T: moduleProb.week9T || "",
        week10T: moduleProb.week10T || "",
        week11T: moduleProb.week11T || "",
        week12T: moduleProb.week12T || "",
        week13T: moduleProb.week13T || "",
        week14T: moduleProb.week14T || "",
        week15T: moduleProb.week15T || "",
    }
    return(
        <List sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
            {Object.entries(initialValue).map(([key, value],index) => (
        <ListItem key={key} sx={{width:"30%",minWidth:"200px"}}>
            <ListItemText primary={stringifyNumber(index+1) + " Week"} secondary={value}/>
        </ListItem>
      ))}
        </List>
    )
}
const ModuleLab=(probs)=>{
    let {moduleProb}=probs;
    console.log(moduleProb);
    let initialValue={
        week1L: moduleProb.week1L || "",
        week2L: moduleProb.week2L || "",
        week3L: moduleProb.week3L || "",
        week4L: moduleProb.week4L || "",
        week5L: moduleProb.week5L || "",
        week6L: moduleProb.week6L || "",
        week7L: moduleProb.week7L || "",
        week8L: moduleProb.week8L || "",
        week9L: moduleProb.week9L || "",
        week10L: moduleProb.week10L || "",
        week11L: moduleProb.week11L || "",
        week12L: moduleProb.week12L || "",
        week13L: moduleProb.week13L || "",
        week14L: moduleProb.week14L || "",
        week15L: moduleProb.week15L || "",
    }
    return(
        <List sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
            {Object.entries(initialValue).map(([key, value],index) => (
        <ListItem key={key} sx={{width:"30%",minWidth:"200px"}}>
            <ListItemText primary={stringifyNumber(index+1) + " Week"} secondary={value}/>
        </ListItem>
      ))}
        </List>
    )
}
const ModuleSSH=(probs)=>{
    let {moduleProb}=probs;
    console.log(moduleProb);
    let initialValue={
        structHoursCR:moduleProb.structHoursCR || {noWeeks:"",noHours:"",totalHours:""},
        structHoursON:moduleProb.structHoursON || {noWeeks:"",noHours:"",totalHours:""},
        structHoursSC:moduleProb.structHoursSC || {noWeeks:"",noHours:"",totalHours:""},
        structHoursLB:moduleProb.structHoursLB || {noWeeks:"",noHours:"",totalHours:""},
        structHoursPR:moduleProb.structHoursPR || {noWeeks:"",noHours:"",totalHours:""},
        structHoursCL:moduleProb.structHoursCL ||{noWeeks:"",noHours:"",totalHours:""},
    }
    function title(key){
        if (key==="structHoursCR")
        return "Inside Classroom";
        else if( key === "structHoursON")
        return "Online Hours"
        else if( key === "structHoursSC")
        return "Studying Cycles"
        else if( key === "structHoursLB")
        return "Lab Hours"
        else if( key === "structHoursPR")
        return "Practical Hours"
        else if( key === "structHoursCL")
        return "Clinical Hours"
    }
    return(
        <List sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
            {Object.entries(initialValue).map(([key, value],index) => (
                <ListItem sx={{minWidth:"200px",width:"30%"}}>
                    <Card sx={{width:"100%",boxShadow:"3"}}>
                    <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title(key)}
        </Typography>
        <List>
            <ListItem>
                <ListItemText primary="Number of weeks" secondary={value.noWeeks}/>
            </ListItem>
            <ListItem>
            <ListItemText primary="Number of Hours" secondary={value.noHours}/>
            </ListItem>
            <ListItem>
            <ListItemText primary="Total Hours" secondary={value.totalHours}/>
            </ListItem>
        </List>
      </CardContent>
                    </Card>
                </ListItem>
      ))}
        </List>
    )
}
const ModuleUSSH=(probs)=>{
    let {moduleProb}=probs;
    console.log(moduleProb);
    let initialValue={
        unStructHours:moduleProb.unStructHours || {},
    }

    return(
        <List sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
            {Object.entries(initialValue).map(([key, value],index) => (
                <ListItem sx={{minWidth:"200px",width:"30%"}}>
                    <Card sx={{width:"100%",boxShadow:"3"}}>
                    <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {key}
        </Typography>
        <List>
            <ListItem>
                <ListItemText primary="Number of weeks" secondary={value.noWeeks}/>
            </ListItem>
            <ListItem>
            <ListItemText primary="Number of Hours" secondary={value.noHours}/>
            </ListItem>
            <ListItem>
            <ListItemText primary="Total Hours" secondary={value.totalHours}/>
            </ListItem>
        </List>
      </CardContent>
                    </Card>
                </ListItem>
      ))}
        </List>
    )
}