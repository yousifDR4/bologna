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
import { get_active_modules, get_control, get_professor_assesments, get_professor_modules, get_progs } from "../../../store/getandset";
import Loader from "../../UI/Loader/Loader";
import AddAssesment from "./AddAssesments";
import { auth } from "../../../store/fire";
import { useQuery } from "react-query";
import { ListSkeleton } from "../DepartmentProfile/Exam/ExamComitte";
import AssesmentGradesTable from "./AssesmentGradesTable";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
const Assesments=()=>{
    const [selectedModule,setSelectedModule]=useState("");
    const [assesments,setAssesments]=useState([{}]);
    const [modules,setModules]=useState([]);
    const [loading,setLoading]=useState(true);
    const [reLoad,setReLoad]=useState(false);
    const profile = useSelector((state) => state.profile.profile);
    const uid = useSelector((state) => state.auth.uid);
    const Department_id = profile.Department_id;
    const theme=useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.only('xl'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isSmallScreen= useMediaQuery(theme.breakpoints.down('sm'));
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
                const p1 = await get_professor_modules(Department_id,profile.username);

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
      },[reLoad,profile]);
      let selectedModuleObject=modules.filter((m)=>m.id===selectedModule).length>0?modules.filter((m)=>m.id===selectedModule)[0]:{};
      const promiseControl=()=> get_control(Department_id,selectedModuleObject ? selectedModuleObject.type : "");
      const {
        data: control={},
        isLoading:isLoadingControl,
        error:isErrorControl,
      isFetching:isFetchingControl, 
      refetch:refetchControl 
      } = useQuery(`department:${Department_id}program:${selectedModuleObject ? selectedModuleObject.type : ""}`, promiseControl, {
       enabled:(!!Department_id && selectedModule !== "" ),
        refetchOnWindowFocus:false,
        select:(data)=>{
            return data ? {...data.docs[0].data(),id:data.docs[0].id} :{}
        }
      }
      );

      const assesmentPromise=()=>get_professor_assesments(Department_id,uid,selectedModule);
      const {
        data: Assesments=[],
        isLoading:isLoadingAssesments,
        error:iserror,
      isFetching:isFetching, 
       refetch
      } = useQuery(`professor:${uid}department:${Department_id}module:${selectedModule}`, assesmentPromise, {
       enabled:(!!selectedModule),
        refetchOnWindowFocus:false,
      
        select:(data)=>{
            return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
        }
      }
      );
      console.log(control);
      console.log(selectedModuleObject);
      let obj=control.hasOwnProperty("enableAssesments")?control.enableAssesments:{};
      let enabledAssesment=selectedModule ?obj.hasOwnProperty(+selectedModuleObject.level)?obj[+selectedModuleObject.level]:true:false;
      console.log(enabledAssesment);
      if(loading){
        return(
            <Loader />
        )
      }
    return(
        <Box sx={{ display:"flex",flexDirection:"column",flexGrow: "1",margin:isSmallScreen ?"0.6rem 0.3rem":"0.6rem 0.6rem 0rem 0.6rem",padding:isSmallScreen ?"0 0.4rem":"0 0.8rem"}}>
        <AppBar position="static" sx={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px",bgcolor:"transparent",boxShadow:"none",}}>
          <Toolbar sx={{ paddingLeft: "0!important",display:"flex",flexWrap:"wrap",gap:"0.8rem" }}>
            <Typography component="span" sx={{flexGrow: 1}}>
            <Typography variant="h5" component="div" sx={{fontFamily:"Graphik",color:"var(--styling1)",display:"inline",marginRight:"0.4rem",fontSize:isSmallScreen ?"1.3rem":"inherit"}} >
              Assessments List
            </Typography>
            <AddAssesment disabled={!enabledAssesment || isLoadingControl} refetch={refetch} setAssesments={setAssesments} selectedModule={selectedModule} modules={modules} edit={false}  />
            </Typography>
            <FormControl sx={{minWidth:"12rem",width:"15%",paddingLeft:"0"}} size="small" >
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
         {modules.map((p)=> <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
        </Select>
        </FormControl>
          </Toolbar>
        </AppBar>
        <Box sx={{border:"none",borderTop:"none",flexGrow:"1",marginBottom:"0.4rem"}}>
        <List sx={{display:"flex",justifyContent:isSmallScreen ?"center":"start",flexWrap:"wrap",gap:"0.5rem",padding:"1rem 0"}}>
        { 
        isLoadingAssesments ? <ListSkeleton/> : Assesments.filter((as)=> as.module===selectedModule).length < 1 ? <Typography variant="h6" sx={{fontFamily:"Graphik",color:"var(--styling1)",width:"100%",textAlign:"center"}}>No assesments were found!</Typography>:
            Assesments.filter((as)=>as.module===selectedModule).map((as)=>{
                return(
     <ListItem key={as.id} sx={{width: '19%',height:"fit-content",minWidth:"300px",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px",display:"flex",flexDirection:"column",gap:"0.5rem",bgcolor:"#fff",padding:"1rem"}}>
                <ArticleIcon sx={{width:"3rem",height:"3rem",color:"var(--styling1)",background:"var(--backGround)",borderRadius:"50%",padding:"0.5rem"}}/>
                <Accordion sx={{boxShadow:"none",border:"1px solid #d1d7dc",fontFamily:"GraphikLight",width:"95%"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          
        >
          {as.title?as.title:"Title Not Found!"}
        </AccordionSummary>
        <AccordionDetails>    
     <List disablePadding sx={{  display:"flex",flexWrap:"wrap"}}>
      <ListItem key="1" sx={{padding:"0"}}>
        <StyledListItemText primary="Date" secondary={`${as.y}/${as.M}/${as.D}` || "-"} />
      </ListItem >
      <ListItem key="2" sx={{padding:"0"}}>
        <StyledListItemText primary="Grade" secondary={as.grades || "-"}  />
      </ListItem>
      <ListItem key="3" sx={{padding:"0"}}>
        <StyledListItemText primary="Notes" secondary={as.notes || "-"} />
      </ListItem>
    </List>  
    </AccordionDetails>
    </Accordion>
    <Box sx={{display:"flex",gap:"0.5rem",width:"100%",marginTop:"0.8rem"}}>
                <AssesmentGradesTable disabled={!enabledAssesment  || isLoadingControl} students={[]} modules={modules} module={selectedModule} assesment={as} />
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