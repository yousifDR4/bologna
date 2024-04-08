import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, ButtonGroup, List, ListItem, ListItemText } from "@mui/material";
import { useSelector } from "react-redux";
import styled from "@emotion/styled";
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Delete } from "@mui/icons-material";
import ArticleIcon from '@mui/icons-material/Article';
import { get_active_modules, get_progs } from "../../../store/getandset";
import Loader from "../../UI/Loader/Loader";
import AddAssesment from "./AddAssesments";
let initcommittes=[
    {
        program:{name:"University of Baghdad",id:"JpF0GPA2vFDPRvfgmzMu"},
        establishNo:"19291",
        establishDate:"2019/2/2",
        checkEDate:"2019/2/5",
        checkENO:"190900",
        notes:"",
        semester:1,
        examCommitte:[{id:"83837373",name:"mohammed",level:1}],
        checkingCommitte:[{id:"83837373",name:"mohammed",level:1}],
        id:"01"
    }
]
let initexams=[
    {
        committe:"01",
        level:"2",
        module:"5v1EYMCREB0zpB5OWRwd",
        try:"1",
        program:"JpF0GPA2vFDPRvfgmzMu",
    }
]
const Assesments=()=>{
    const [selectedModule,setSelectedModule]=useState("");
    const [assesments,setExams]=useState([]);
    const [modules,setModules]=useState([]);
    const [loading,setLoading]=useState(true);
    const [reLoad,setReLoad]=useState(false);
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const handleChange = (event) => {
        setSelectedModule(event.target.value);
      };
      useEffect(()=>{
        const loadCommittes=async ()=>{
            setLoading(true);
            try{
                let Lprograms= await get_progs(Department_id);
                let progType=Lprograms.filter((p)=>profile.program==p.id).length > 0 ? Lprograms.filter((p)=>profile.program==p.id)[0].type:"";
                console.log(progType,Department_id,profile.level);
                const p1 = await get_active_modules(Department_id,progType,profile.level);
                setModules(p1);
                setLoading(false);
            }
            catch(e){
              console.log(e);
                setLoading(false);
            }
        }
        if(Department_id){
        loadCommittes();
        }
      },[reLoad,profile])
      if(loading){
        return(
            <Loader />
        )
      }
    return(
        <Box sx={{ display:"flex",flexDirection:"column",flexGrow: "1",margin:"0.6rem 0.6rem 0rem 0.6rem",padding:"0 0.8rem"}}>
        <AppBar position="static" sx={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px",bgcolor:"transparent",boxShadow:"none",}}>
          <Toolbar sx={{paddingLeft:"0!important"}}>
            <Typography component="span" sx={{flexGrow: 1}}>
            <Typography variant="h5" component="div" sx={{fontFamily:"Graphik",color:"var(--styling1)",display:"inline",marginRight:"0.8rem"}} >
              Assesments List
            </Typography>
            <AddAssesment  selectedModule={selectedModule} modules={modules} edit={false}  />
            </Typography>
            <FormControl sx={{minWidth:"8rem",width:"15%",paddingLeft:"0"}} size="small" >
            <InputLabel id="module" sx={{color:"var(--styling1) !important"}}>Module</InputLabel>
            <Select
          id="module"
          label="Module"
          labelId="module"
          onChange={handleChange}
          value={selectedModule}
           sx={{
        height: '2.5rem',
        bgcolor:"#fff",
        color: 'var(--styling1)',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--styling1) !important'
        },
        '& .MuiSvgIcon-root': {
            color: 'var(--styling1)'
        }
    }}
    variant="outlined"
        >
         {modules.map((p)=> <MenuItem value={p.id}>{p.name}</MenuItem>)}
        </Select>
        </FormControl>
          </Toolbar>
        </AppBar>
        <Box sx={{border:"none",borderTop:"none",flexGrow:"1",marginBottom:"0.4rem"}}>
        <List sx={{display:"flex",gap:"0.5rem",padding:"1rem 0"}}>
        { 
         assesments.filter((as)=> as.module===selectedModule).length < 1 ? <Typography variant="h6" sx={{fontFamily:"Graphik",color:"var(--styling1)",width:"100%",textAlign:"center"}}>No assesments were found!</Typography>:
            assesments.filter((as)=>as.module===selectedModule).map((as)=>{
                return(
     <ListItem key={as.id} sx={{width: '19%',minWidth:"250px",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px",display:"flex",flexDirection:"column",gap:"0.5rem",bgcolor:"#fff",padding:"1rem"}}>
                <ArticleIcon sx={{width:"3rem",height:"3rem",color:"var(--styling1)",background:"var(--backGround)",borderRadius:"50%",padding:"0.5rem"}}/>
                <Accordion sx={{boxShadow:"none",border:"1px solid #d1d7dc",fontFamily:"GraphikLight",width:"95%"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          
        >
          {as.title?as.title:"Exam Not Found!"}
        </AccordionSummary>
        <AccordionDetails>    
     <List disablePadding sx={{  display:"flex",flexWrap:"wrap"}}>
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Date" secondary={as.date || "-"} />
      </ListItem >
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Grade" secondary={as.grade || "-"}  />
      </ListItem>
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Notes" secondary={as.notes || "-"} />
      </ListItem>
    </List>  
    </AccordionDetails>
    </Accordion>
    <Box sx={{display:"flex",gap:"0.5rem",width:"100%",marginTop:"0.8rem"}}>
          <Button startIcon={<Delete/>} sx={{'&:hover':{bgcolor:"#a2d0fb !important",border:"none"},bgcolor:"#add5fb !important",width:"50%",boxShadow:"none"}} variant="contained">Delete</Button>
        </Box>
            </ListItem>
                )
            })}
        </List>
      
        </Box>
      </Box>
    );
}
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
export default Assesments;