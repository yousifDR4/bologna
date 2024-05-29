import { useEffect, useState } from "react"
import { Delete, Details, Grade, Info } from "@mui/icons-material";
import ArticleIcon from '@mui/icons-material/Article';
import { Button, ButtonGroup, Grid, List, ListItem, ListItemText } from "@mui/material";
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
import { auth } from "../../../../store/fire";
import { useSelector } from "react-redux";
import { get_Subjects, get_active_modules, get_professor_modules, get_progs } from "../../../../store/getandset";
import Loader from "../../../UI/Loader/Loader";
import ViewModule from "../../StudentProfile/Modules/ViewModule";
import StudentGrades from "./StudentGrades";
import ModuleStudents from "./ModuleStudents";
import StudentsAttendance from "../../StudentProfile/Modules/ModuleAttendance";
const ProfessorModules=()=>{
    const [professorModules,setProfessorModules]=useState([]);
    const [programs, setPrograms] = useState([]);
    const [modules,setModules]=useState([]);
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    useEffect(() => {
      console.log("NNNN");
      if (!auth.currentUser) return;
      const f = async () => {
        try {
          console.log(profile);
          setLoading(true);
          const p1 = get_professor_modules(Department_id,profile.username);
          const p2 = get_Subjects(Department_id);
          // Access data for each document snapshot in the array
          const [modules,Sujects] = await Promise.all([p1,p2]);
          setModules(Sujects);
          setProfessorModules(modules);
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
    let profModules=professorModules.filter((mod)=>mod.manager===profile.username);
    let locMod= modules.filter((mod)=>profModules.some((m)=>m.module===mod.id));
    return(
        <>
         <Box sx={{ width:"100%",display:"flex",flexDirection:"column",margin:"0.6rem 0.6rem 0rem 0.6rem",padding:"0 0.8rem"}}>
        <AppBar position="static" sx={{width:"100%",borderTopLeftRadius:"10px",borderTopRightRadius:"10px",bgcolor:"transparent",boxShadow:"none",}}>
          <Toolbar sx={{display:"flex",flexWrap:"wrap",paddingLeft:"0!important"}}>
            <Typography variant="h5" component="div" sx={{fontFamily:"Graphik",width:"100%",color:"var(--styling1)",display:"inline",marginRight:"0.8rem"}} >
              Modules List
            </Typography>
            </Toolbar>
        </AppBar>
        <Box sx={{width:"100%",border:"none",borderTop:"none",flexGrow:"1",marginBottom:"0.4rem"}}>
          <CardsContainer>
            <CustomGridItem>
            <CustomCard title="Modules" subtitle="Number of modules." value={locMod.length}/>
            </CustomGridItem>
            <CustomGridItem>
            <CustomCard title="Core" subtitle="Number of Core type modules." value={locMod.filter((mod)=>mod.type === "core").length}/>
            </CustomGridItem>
            <CustomGridItem >
            <CustomCard title="Support" subtitle="Number of Support type modules." value={locMod.filter((mod)=>mod.type === "support").length}/>
            </CustomGridItem>
            <CustomGridItem >
            <CustomCard title="Elective" subtitle="Number of Elective type modules." value={locMod.filter((mod)=>mod.type === "elective").length}/>
            </CustomGridItem>
            </CardsContainer>
        <List sx={{display:"flex",marginTop:"1rem",gap:"0.5rem",padding:"1rem 0",flexWrap:"wrap"}}>
        { 
         professorModules.length < 1 ? <Typography variant="h6" sx={{fontFamily:"Graphik",color:"var(--styling1)",width:"100%",textAlign:"center"}}>No Modules were Found!</Typography>:
            professorModules.map((mod)=>{
                return(
     <ListItem key={mod.id} sx={{fontFamily:"GraphikLight",width: '19%',minWidth:"300px",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px",display:"flex",flexDirection:"column",gap:"0.5rem",bgcolor:"#fff",padding:"1rem"}}>
    <ArticleIcon sx={{width:"3rem",height:"3rem",color:"var(--styling1)",background:"var(--backGround)",borderRadius:"50%",padding:"0.5rem"}}/>
    {modules.filter((modu)=>modu.id===mod.module)[0].name}
     <List sx={{fontFamily:"GraphikLight",  display:"flex",flexWrap:"wrap"}}>
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Name" secondary= {modules.filter((modu)=>modu.id===mod.module)[0].name} />
      </ListItem >
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Code" secondary={modules.filter((modu)=>modu.id===mod.module)[0].code}  />
      </ListItem>
    </List>  
    <Box sx={{display:"flex",flexWrap:"wrap",gap:"0.5rem",width:"100%",marginTop:"0.8rem"}}>
      <ViewModule moduleProb={mod} name={modules.filter((modu)=>modu.id===mod.module)[0].name}/>
      <StudentGrades moduleName={modules.filter((modu)=>modu.id===mod.module)[0].name} module={mod}/>
      <ModuleStudents moduleName={modules.filter((modu)=>modu.id===mod.module)[0].name} module={mod}/>
      <StudentsAttendance moduleName={modules.filter((modu)=>modu.id===mod.module)[0].name} module={mod}/>
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
  const {title="",subtitle="",value}=probs;
  return(
    <Card sx={{ width:"100%",
    height:"160px",
    color:"var(--styling1)",
    bgcolor:"#d1e5f7",
    fontFamily:"GraphikLight" }}>
    <CardContent>
      <Typography sx={{ fontSize: 14 ,fontFamily:"GraphikLight"}}  gutterBottom>
        {title}
      </Typography>
      <Typography fontFamily="Graphik" variant="h4" component="div" color="#4986D5" marginBottom={2}>
        {value}
      </Typography>
      <Typography fontFamily="GraphikLight" variant="body2" >
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
  )
}
export const CardsContainer=(props)=>{
  return(
    <Grid  container 
    sx={{display:"grid",width:"100%",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))"}}
    // sx={{width:"100%",display:"flex",}} 
    spacing={{xs:1,sm:2,lg:3,xl:8}}>
    {props.children}
    </Grid>
  )
}
export const CustomGridItem=(props)=>{
  return(
    <Grid item

    // sx={{
    //   flexGrow:"1",
    //   flexShrink:"1",
    //   flexBasis:"35ch",
    // }}
    >
      {props.children}
    </Grid>
  )
}
export default ProfessorModules;