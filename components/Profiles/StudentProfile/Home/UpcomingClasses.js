import { Box, Card, List, ListItem, Typography } from "@mui/material";

const UpcomingClasses=(probs)=>{
let {schedule}=probs;
const now = new Date();
const day = now.getDay();
const hour = now.getHours();
const minute = now.getMinutes();
console.log(day,hour,minute);

    let upcomingClasses=schedule.filter((classSch)=>{
        const [startHours, startMinutes] = classSch.startingTime.split(':').map(Number);

        return (classSch.day === day +1 && startHours >= hour && (startHours === hour ? startMinutes >= minute:true));
        });

console.log(upcomingClasses);
return(
    <Card sx={{bgcolor:"#fff",padding:"0.6rem 0.8rem",boxSizing:"border-box",width:"max(55%,20rem,350px)",minHeight:200}}>
    <Typography variant="h6" gutterBottom fontFamily="Graphik" color="var(--styling1)">
      Upcoming Classes  
      </Typography>
        <List disablePadding sx={{width:"100%",textAlign:"center"}}>
            {
                upcomingClasses.length === 0 ? <Typography variant="body1" color="text.secondary" marginTop="1rem">No Classes Found</Typography>:""
            }
            {upcomingClasses.map((c)=>
                <ListItem id={c.id} sx={{display:"flex",flexWrap:"wrap",rowGap:"0.7rem",columnGap:"1.5rem",padding:"0.8rem",bgcolor:"Highlight",borderRadius:"0.3rem"}}>
                    <Typography component="span">
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Module
                        </Typography>
                        <Typography variant="body2">
                            {c.moduleId}
                        </Typography>
                    </Typography>
                    <Typography component="span">
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Room
                    </Typography>
                    <Typography variant="body2">
                            {c.classroomId}
                    </Typography>
                    </Typography>
                    <Typography component="span">
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Time
                    </Typography>
                    <Typography variant="body2">
                            {c.startingTime + " - " + c.endingTime}
                    </Typography>
                    </Typography>
                </ListItem>
            )}
        </List>
    </Card>
)
}
export default UpcomingClasses;