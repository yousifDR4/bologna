import { Box, Card, CardContent, CardHeader, CardMedia, Dialog, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { get_active_modules, get_progs } from "../../../store/getandset";
import Loader from "../../UI/Loader/Loader";
import { auth } from "../../../store/fire";
import profilePicture from "../../../Images/profilePicutre.jpg"
import { Book, BookRounded, BookmarksRounded, Edit, Subject, SubjectRounded } from "@mui/icons-material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import EditProfile from "../UniversityProfile/EditProfile";
function StudentProfile() {
    const profile = useSelector((state) => state.profile.profile);
    const [programs,setPrograms]=useState([]);
    const [modules,setModules]=useState([]);
    const Department_id = profile.Department_id;
    const [loading,setLoading]=useState(true);
    const theme = useTheme();
    const [edit,setEdit]=useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        console.log("NNNN");
        if (!auth.currentUser) return;
        const f = async () => {
          try {
            setLoading(true);
            let Lprograms= await get_progs(Department_id);
              let progType=Lprograms.filter((p)=>profile.program==p.id).length > 0 ? Lprograms.filter((p)=>profile.program==p.id)[0].type:"";
              const p1 = get_active_modules(Department_id,progType,profile.level);
              const [modules] = await Promise.all([p1]);
              setModules(modules);
              setPrograms(Lprograms);
          } catch (e) {
            console.log(e);
          } finally {
            setLoading(false);
          }
        };
        if (Department_id) {
          f();
        }
      }, [ profile, Department_id]);
      let studentProgram=programs.filter((p)=>profile.program==p.id).length > 0 ? programs.filter((p)=>profile.program==p.id)[0]:{};

      const handleEdit=()=>{
        setEdit((prev)=>!prev);
      }
      if(loading){
        return <Loader/>
      }
    return (
        <>
        {edit &&<Dialog fullWidth open={edit} onClose={()=>setEdit(false)}><EditProfile studentProfile={true} showEdit={setEdit} profilePicture={profile.profilePicture}/></Dialog>}
        <Box sx={{width:"100%",display:"grid",justifyItems:"center",paddingTop:"0.6rem"}}>
    <Box sx={{width:"100%",height:"fit-content",maxWidth:"1200px",display:"flex",flexDirection:"column",borderRadius:"10px",boxShadow:"2"}}>
        <Card sx={{borderRadius:"0",boxShadow:"none",}}>
            <CardHeader    title={profile.firstname + profile.lastname} action={<IconButton aria-label="Edit Profile" title="Edit Profile" onClick={handleEdit}><Edit/></IconButton>}
        subheader={`@${profile.username}`}/>
            <CardContent sx={{display:"flex",width:"100%",justifyContent:isSmallScreen?"center":"flex-start",flexDirection:"row",flexWrap:"wrap"}}>
                <CardMedia     sx={{width:isSmallScreen?"100%":"32%",minWidth:"250px",minHeight:"250px",backgroundSize:"contain"}} image={profile.profilePicture ? profile.profilePicture : profilePicture}/>
                <List sx={{width:"32%",minWidth:"150px",}}>
                    <ListItem>
                        <ListItemText primary="Sex" secondary={profile.sex || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Student Id" secondary={profile.number || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="University" secondary={profile.University_id || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="College" secondary={profile.College_id || "-"}/>
                    </ListItem>
                </List>
                <List sx={{width:"33%",minWidth:"150px"}}>
                    <ListItem>
                        <ListItemText primary="Department" secondary={profile.Department_id || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Program" secondary={studentProgram.name || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Level" secondary={profile.level || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="ECTS Accomplished" secondary={0}/>
                    </ListItem>
                </List>
            </CardContent>
        </Card>
        <Box sx={{width:"100%",display:"flex",justifyContent:isSmallScreen?"center":"flex-start",flexDirection:"row",flexWrap:"wrap",gap:"0.8rem",bgcolor:"#fff",padding:"16px"}}>
        <Card sx={{width:"49%",boxShadow:"none",minWidth:"320px",bgcolor:"rgba(0, 0, 0, 0.03)"}}>
            <CardContent>
                <List subheader={<ListSubheader sx={{bgcolor:"inherit"}}>Current semester information</ListSubheader>}>
                <ListItem>
                        <ListItemText primary="Current Semester" secondary={"First"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Number of Modules" secondary={profile.registedModules || "-"}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Modules by Exam only" secondary={"-"}/>
                    </ListItem>
                </List>
            </CardContent>
        </Card>
        <List subheader={<ListSubheader>Registered Modules</ListSubheader>} sx={{width:"49%",borderRadius:"8px",boxShadow:"none",minWidth:"320px",border:"1px solid rgba(0, 0, 0, 0.1)"}}>
       {modules.length === "0" && <Typography textAlign="center" color="text.secondary"> No modules were found!</Typography>}
        {modules.map((mod)=>(<ListItem >
                <BookRounded sx={{width:"2.8rem",height:"2.8rem",color:"rgba(0, 0, 0, 0.5)",background:"rgba(0, 0, 0, 0.03)",borderRadius:"50%",padding:"0.4rem",marginRight:"0.5rem"}}/>
            
            <ListItemText primary="Module Name" secondary={mod.name}/>
            </ListItem>))}
        </List>
        </Box>
    </Box>
    </Box> 
    </>);
}

export default StudentProfile;

