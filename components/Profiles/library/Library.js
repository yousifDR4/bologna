import { useEffect, useState } from "react"
import { Delete, Details, Grade, Info } from "@mui/icons-material";
import ArticleIcon from '@mui/icons-material/Article';
import { Button, ButtonGroup, Grid, Link, List, ListItem, ListItemText } from "@mui/material";
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
import { auth } from "../../../store/fire";
import { useSelector } from "react-redux";
import { get_Subjects, get_active_completed_modules, get_active_modules, get_progs } from "../../../store/getandset";
import Loader from "../../UI/Loader/Loader";
const Library=()=>{
    const [studentModules,setStudentModules]=useState([]);
    const [modules,setModules]=useState([]);
    const theme = useTheme();
    const [books,setBooks]=useState([]);
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
          let Lprograms= await get_progs(Department_id);
          console.log(Lprograms);
          let progType=Lprograms.filter((p)=>profile.program==p.id).length > 0 ? Lprograms.filter((p)=>profile.program==p.id)[0].type:"";
          console.log(progType,Department_id,profile.level);
          const p1 = get_active_completed_modules(Department_id,progType,profile.level);
          const p2 = get_Subjects(Department_id);
          let lBooks=[];
          const [modules,Sujects] = await Promise.all([p1,p2]);
          console.log(modules);
          setModules(Sujects);
          setStudentModules(modules);
          modules.map((mod)=>{
            if(mod.books){
                mod.books.map((b)=>{
                  console.log(b);
                    if(b.url){
                        if(b.url.length >0){
                            lBooks.push({...b,module:mod.module});
                        }
                    }
                })
            }
          })
          console.log(lBooks);
          setBooks(lBooks);
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
    return(
        <>
         <Box sx={{ width:"100%",display:"flex",flexDirection:"column",margin:"0.6rem 0.6rem 0rem 0.6rem",padding:"0 0.8rem"}}>
        <AppBar position="static" sx={{width:"100%",borderTopLeftRadius:"10px",borderTopRightRadius:"10px",bgcolor:"transparent",boxShadow:"none",}}>
          <Toolbar sx={{display:"flex",flexWrap:"wrap",paddingLeft:"0!important"}}>
            <Typography variant="h5" component="div" sx={{fontFamily:"Graphik",width:"100%",color:"var(--styling1)",display:"inline",marginRight:"0.8rem"}} >
              Library
            </Typography>
            </Toolbar>
        </AppBar>
        <Box sx={{width:"100%",border:"none",borderTop:"none",flexGrow:"1",marginBottom:"0.4rem"}}>
        <List sx={{display:"flex",marginTop:"1rem",gap:"0.5rem",padding:"1rem 0"}}>
        { 
         books.length < 1 ? <Typography variant="h6" sx={{fontFamily:"Graphik",color:"var(--styling1)",width:"100%",textAlign:"center"}}> No Books were Found!</Typography>:
            books.map((book)=>{
                return(
     <ListItem key={book.name + book.module} sx={{fontFamily:"GraphikLight",width: '19%',minWidth:"300px",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px",display:"flex",flexDirection:"column",gap:"0.7rem",bgcolor:"#fff",padding:"1rem"}}>
    <ArticleIcon sx={{width:"3rem",height:"3rem",color:"var(--styling1)",background:"var(--backGround)",borderRadius:"50%",padding:"0.5rem"}}/>
    {book.name}
     <List sx={{fontFamily:"GraphikLight",  display:"flex",flexWrap:"wrap"}}>
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Module" secondary= {modules.filter((modu)=>modu.id===book.module).length > 0 ? modules.filter((modu)=>modu.id===book.module)[0].name : "Module not found"}  />
      </ListItem >
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Available in library" secondary={book.available?"Availble":"Not Available"}  />
      </ListItem>
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="File" secondary={<Link  href={book.url}>View Book</Link>} />
      </ListItem>
    </List>  
    <Box sx={{display:"flex",gap:"0.5rem",width:"100%",marginTop:"0.8rem"}}>
        </Box>
            </ListItem>
            )}
              )  }
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
    <Card sx={{ width:"100%",maxWidth:"300px",minWidth: 275,height:"160px",color:"var(--styling1)",bgcolor:"#d1e5f7",fontFamily:"GraphikLight" }}>
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
export default Library;