import { useState } from "react"
import { Delete } from "@mui/icons-material";
import ArticleIcon from '@mui/icons-material/Article';
import { Button, ButtonGroup, List, ListItem, ListItemText } from "@mui/material";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const StudentModules=()=>{
    const [studentModules,setStudentModules]=useState([]);
    return(
        <>
         <Box sx={{ display:"flex",flexDirection:"column",flexGrow: "1",margin:"0.6rem 0.6rem 0rem 0.6rem",padding:"0 0.8rem"}}>
        <AppBar position="static" sx={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px",bgcolor:"transparent",boxShadow:"none",}}>
          <Toolbar sx={{paddingLeft:"0!important"}}>
            <Typography variant="h5" component="div" sx={{fontFamily:"Graphik",color:"var(--styling1)",display:"inline",marginRight:"0.8rem"}} >
              Exams List
            </Typography>
            </Toolbar>
        </AppBar>
        <Box sx={{border:"none",borderTop:"none",flexGrow:"1",marginBottom:"0.4rem"}}>

        <List sx={{display:"flex",gap:"0.5rem",padding:"1rem 0"}}>
        { 
         studentModules.length < 1 ? <Typography variant="h6" sx={{fontFamily:"Graphik",color:"var(--styling1)",width:"100%",textAlign:"center"}}>No modules were found!</Typography>:
            studentModules.map((mod)=>{
                return(
     <ListItem key={mod.id} sx={{width: '19%',minWidth:"250px",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px",display:"flex",flexDirection:"column",gap:"0.5rem",bgcolor:"#fff",padding:"1rem"}}>
    <ArticleIcon sx={{width:"3rem",height:"3rem",color:"var(--styling1)",background:"var(--backGround)",borderRadius:"50%",padding:"0.5rem"}}/>
    {modules.filter((modu)=>modu.id===mod.module)[0].name}
     <List sx={{  display:"flex",flexWrap:"wrap"}}>
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Name" secondary= {modules.filter((modu)=>modu.id===mod.module)[0].name} />
      </ListItem >
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Code" secondary={modules.filter((modu)=>modu.id===mod.module)[0].code}  />
      </ListItem>
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Type" secondary={mod.registerType} />
      </ListItem>
    </List>  
    <Box sx={{display:"flex",gap:"0.5rem",width:"100%",marginTop:"0.8rem"}}>
          <Button startIcon={<Delete/>} sx={{'&:hover':{bgcolor:"#a2d0fb !important",border:"none"},bgcolor:"#add5fb !important",width:"50%",boxShadow:"none"}} variant="contained">Delete</Button>
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