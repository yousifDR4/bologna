import { useEffect, useState } from "react"
import { Check, CheckBox, Clear, Delete, Details, Edit, Error, Grade, Info, IntegrationInstructions, X } from "@mui/icons-material";
import ArticleIcon from '@mui/icons-material/Article';
import { Button, ButtonGroup, CardMedia, Checkbox, FormControl, FormControlLabel, Grid, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import styled from "styled-components";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { auth, db } from "../../../store/fire";
import { useSelector } from "react-redux";
import { get_Subjects, get_active_modules, get_progs } from "../../../store/getandset";
import Loader from "../../UI/Loader/Loader";
import ViewModule from "./Modules/ViewModule";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SaveIcon from '@mui/icons-material/Save';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { doc, setDoc } from "firebase/firestore";
function arrayEquals(a, b) {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}
const ModulesRegisteration=()=>{
    const [studentModules,setStudentModules]=useState([]);
    const [programs, setPrograms] = useState([]);
    const [modules,setModules]=useState([]);
    const [registerdModules,setRegisteredModules]=useState([]);
    const [initialRegMod,setInitialRegMod]=useState([]);
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const [edit,setEdit]=useState(false);
    const [viewInstructions,setViewInstruction]=useState(true);
    let registeredECTS=0;
    let registerdCore=0;
    let registeredSupp=0;
    let registeredElec=0;
    for(let i=0;i<registerdModules.length ;i++){
      registeredECTS+= +studentModules.filter((m)=>m.id === registerdModules[i])[0].ECTS;
      if(studentModules.filter((m)=>m.id === registerdModules[i])[0].type === "core" || false){
        registerdCore += 1;
      }
      if(studentModules.filter((m)=>m.id === registerdModules[i])[0].type === "support" || false){
        registeredSupp += 1;
      }
      if(studentModules.filter((m)=>m.id === registerdModules[i])[0].type === "elective" || false){
        registeredElec += 1;
      }
    }

    const isRegisterationValid={
      "ECTS":+registeredECTS === 30,
      "Core": +registerdCore === studentModules.filter((mod)=>mod.type === "core").length,
      }
    const handleClick=(actionName)=>{
      switch (actionName) {
        case "Edit":
          setEdit(true);
          break;
          case "View Instructions":
            setViewInstruction(true);
            break;
        default:
          break;
      }
    }

    const handleCheck=(id)=>{
      if(registerdModules.includes(id)){
        console.log("trueee");
        setRegisteredModules((prev)=>prev.filter((modId)=>modId !== id));
      }
      else{
        setRegisteredModules((prev)=>{return [id,...prev]});
      }
    }

    useEffect(() => {
      console.log("NNNN");
      if (!auth.currentUser) return;
      const f = async () => {
        try {
          setInitialRegMod([]);
          setRegisteredModules([]);
          console.log(profile);
          setLoading(true);
          let Lprograms= await get_progs(Department_id);
          console.log(Lprograms);
          setPrograms(Lprograms);
          let progType=Lprograms.filter((p)=>profile.program==p.id).length > 0 ? Lprograms.filter((p)=>profile.program==p.id)[0].type:"";
          console.log(progType,Department_id,profile.level);
          const p1 = get_active_modules(Department_id,progType,profile.level);
          const p2 = get_Subjects(Department_id);
          // Access data for each document snapshot in the array
          const [modules,Sujects] = await Promise.all([p1,p2]);
          setModules(Sujects);
          console.log(modules);
          setStudentModules(modules.filter((mod)=>mod.progress === 100));
          console.log(Sujects);
        } catch (e) {
          console.log(e); 
        } finally {
          setLoading(false);
        }
      };
      if (Department_id) {
        f();
      }
    }, [profile, Department_id]);
    if(loading){
      return <Loader/>
    }
    studentModules.filter((mod)=>registerdModules.includes(mod.id));
    console.log(registerdModules);
    console.log(initialRegMod);
    console.log(registeredECTS);
    const regesterstionhandler=
    async()=>
    {
    setDoc(doc(db,"users",auth.currentUser.uid),{registerdModules:registerdModules},
    {merge:true})
    }
    return(
        <>
        <Instructions open={viewInstructions} setOpen={setViewInstruction} />
        <BasicSpeedDial handleClick={handleClick}/>
         <Box sx={{ width:"100%",display:"flex",flexDirection:"column",margin:"0.6rem 0.6rem 0rem 0.6rem",padding:"0 0.8rem"}}>
        <AppBar position="static" sx={{width:"100%",borderTopLeftRadius:"10px",borderTopRightRadius:"10px",bgcolor:"transparent",boxShadow:"none",}}>
          <Toolbar sx={{display:"flex",flexWrap:"wrap",paddingLeft:"0!important"}}>
            <Typography variant="h5" component="div" sx={{fontFamily:"Graphik",flex:"1",width:"100%",color:"var(--styling1)",display:"inline",marginRight:"0.8rem"}} >
              Modules List
            </Typography>
            <Button type="button" onClick={regesterstionhandler} disabled={!edit} variant={!edit  ? "contained":"outlined"} startIcon={<SaveIcon/>}>Save Changes</Button>
            </Toolbar>
        </AppBar>
        <Box sx={{width:"100%",border:"none",borderTop:"none",flexGrow:"1",marginBottom:"0.4rem"}}>
          <Grid container sx={{width:"100%", gridTemplateColumns:"1fr 1fr 1fr 1fr",display:"grid"}} gridTemplateColumns={{xs:"1fr",sm:"1fr 1fr",lg:"1fr 1fr 1fr",xl:"1fr 1fr 1fr 1fr"}} spacing={{xs:1,sm:2,lg:3,xl:8}}>
            <Grid item >
            <CustomCard valid={isRegisterationValid.ECTS} title="ECTS" subtitle="Number of ECTS points." value={`${registeredECTS}/30`}/>
            </Grid>
            <Grid item>
            <CustomCard valid={isRegisterationValid.Core} title="Core" subtitle="Number of Core type modules." value={`${registerdCore}/${studentModules.filter((mod)=>mod.type === "core").length}`}/>
            </Grid>
            <Grid item>
            <CustomCard title="Support" subtitle="Number of Support type modules." value={`${registeredSupp}/${studentModules.filter((mod)=>mod.type === "support").length}`}/>
            </Grid>
            <Grid item>
            <CustomCard title="Elective" subtitle="Number of Elective type modules." value={`${registeredElec}/${studentModules.filter((mod)=>mod.type === "elective").length}`}/>
            </Grid>
          </Grid>
        <List sx={{display:"flex",marginTop:"1rem",gap:"0.5rem",padding:"1rem 0"}}>
        { 
         studentModules.length < 1 ? <Typography variant="h6" sx={{fontFamily:"Graphik",color:"var(--styling1)",width:"100%",textAlign:"center"}}>No Modules were Found!</Typography>:
            studentModules.map((mod)=>{
                return(
     <ListItem key={mod.id} sx={{fontFamily:"GraphikLight",width: '19%',minWidth:"300px",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px",display:"flex",flexDirection:"column",gap:"0.5rem",bgcolor:"#fff",padding:"1rem"}}>
    <ArticleIcon sx={{width:"3rem",height:"3rem",color:"var(--styling1)",background:"var(--backGround)",borderRadius:"50%",padding:"0.5rem"}}/>
    {modules.filter((modu)=>modu.id===mod.module)[0].name}
     <List sx={{fontFamily:"GraphikLight",width:"100%",  display:"flex",flexWrap:"wrap"}}>
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Name" secondary= {modules.filter((modu)=>modu.id===mod.module)[0].name} />
      </ListItem >
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Code" secondary={modules.filter((modu)=>modu.id===mod.module)[0].code}  />
      </ListItem>
    </List>  
    <Box sx={{display:"flex",gap:"0.5rem",width:"100%",marginTop:"0.8rem"}}>
      <ViewModule moduleProb={mod} name={modules.filter((modu)=>modu.id===mod.module)[0].name}/>
      <FormControl sx={{border:"1px solid rgba(25, 118, 210, 0.5)",width:"50%",borderRadius:"4px",color:"#1976d2",padding:"8px 15px"}}>
      <FormControlLabel sx={{margin:"0"}} control={<Checkbox sx={{padding:"0"}} disabled={!edit} checked={registerdModules.includes(mod.id)} onClick={()=>handleCheck(mod.id)} />} label="Registered" />
      </FormControl>
        </Box>
            </ListItem>
                )
            })}
        </List>
        </Box>
      </Box>
        </>
    )
}

//*************************************************end of main component********************************************

const StyledListItemText=styled(ListItemText)(({theme})=>({
  '& .MuiListItemText-primary': {
    fontFamily: "GraphikLight",
    fontSize: "0.8rem !important",
    color:"#595d61"
  },
  '& .MuiListItemText-secondary':{
    color:"var(--mainText)"
  }
}))
const CustomCard=(probs)=>{
  const {title="",subtitle="",valid=true,value}=probs;
  return(
    <Card sx={{ width:"100%",maxWidth:"300px",minWidth: 275,height:"160px",color:valid ? "var(--styling1)": "#d32f2f",bgcolor:valid ?"#d1e5f7":"#e7c0c0",fontFamily:"GraphikLight" }}>
    <CardContent>
      <Typography sx={{display:"flex",width:"100%"}}>
      <Typography sx={{ fontSize: 14 ,fontFamily:"GraphikLight",flex:"1"}}  gutterBottom>
        {title}
      </Typography>
      <CardMedia>{valid ? <Check/> : <Clear/>}</CardMedia>
      </Typography>
      <Typography fontFamily="Graphik" variant="h4" component="div" color={valid ? "#4986D5":"#d32f2f"} marginBottom={2}>
        {value}
      </Typography>
      <Typography fontFamily="GraphikLight" variant="body2" >
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
  )
}
const actions = [
  { icon: <Edit />, name: 'Edit' },
  { icon: <IntegrationInstructions />, name: 'View Instructions' },

];

function BasicSpeedDial(probs) {
  let {handleClick}=probs;
  return (
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 30, right: 30,zIndex:"5" }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={()=>handleClick(action.name)}
          />
        ))}
      </SpeedDial>

  );
}

function Instructions(probs) {
  let {open,setOpen}=probs;
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
        Modules Registration Instruction
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
         Please read this instruction before forwarding to the registration process
         </ListSubheader>
      }
    >
      <ListItem>
        <ListItemIcon>
          <Info />
        </ListItemIcon>
        <ListItemText primary="The registration process last for only ten days" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Info />
        </ListItemIcon>
        <ListItemText primary="You will not be able to modify your modules registrations after the end of registration period" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Info />
        </ListItemIcon>
        <ListItemText primary="Only the modules that you are able to register in will be shown to you, any modules that you don't satisify it's prequesties won't be shown" />
        </ListItem>
        <ListItem>
        <ListItemIcon>
          <Info />
        </ListItemIcon>
        <ListItemText primary="The Maximum and minimum allowed number of ECTS points is 30" />
        </ListItem>
        <ListItem>
        <ListItemIcon>
          <Info />
        </ListItemIcon>
        <ListItemText primary="Modules that you failed in past semesters will only be shown if activated by the department" />
        </ListItem>
    </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>continue</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default ModulesRegisteration;