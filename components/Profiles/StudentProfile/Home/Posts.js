import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import img from "../../../../Images/UniversityofBaghdad.png"
import { Skeleton, Typography } from '@mui/material';
const Posts=(probs)=>{
    let {notices=[],loading,users=[]}=probs;
    console.log(users);
    return(<>
    <List disablePadding title='Posts' sx={{width:"100%"}} >
        <Typography variant='h6' fontFamily="Graphik" color="text.secondary">Posts</Typography>
           {  loading.notices ? <LoadingSkeleton/>:notices.map((not)=>
                <Accordion sx={{marginBottom:"0.5rem"}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                <ListItem>
                  <ListItemAvatar>
                   <Avatar src={users.filter((u)=>u.id===not.user)[0]?.profilePicture ?users.filter((u)=>u.id===not.user)[0]?.profilePicture :img} alt="profile picture" sx={{width:"3.5rem",height:"3.5rem"}}>
                   </Avatar>
                 </ListItemAvatar>
                 <ListItemText primary={not.title} secondary={not.user} sx={{marginLeft:"0.5rem"}}/>
               </ListItem>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography fontFamily="GraphikLight">
                  {not.description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )
        }
    </List>

    </>)
}
const LoadingSkeleton=()=>{
  return(
    <>
    <Skeleton sx={{height:"96px",width:"100%",minWidth:"250px",marginBottom:"0.5rem",WebkitTransform:"none"}}></Skeleton>
    <Skeleton sx={{height:"96px",width:"100%",minWidth:"250px",marginBottom:"0.5rem",WebkitTransform:"none"}}></Skeleton>
    </>
  )
}
export default Posts;