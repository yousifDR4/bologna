import { Box, Card, List, ListItem, Skeleton, Typography } from "@mui/material";

const UpcomingClasses=(probs)=>{
let {schedule,professorModules=[],modules=[],classrooms=[],loading}=probs;
const now = new Date();
const day = now.getDay();
const hour = now.getHours();
const minute = now.getMinutes();
function findName(module){
let pModule=professorModules.filter((mod)=>(mod.id === module.module)).length >0 ?professorModules.filter((mod)=>(mod.id === module.module))[0]:[];
let moduleName= pModule?.id ? modules.filter((m)=>m.id===pModule.module).length>0 ?modules.filter((m)=>m.id===pModule.module)[0].name:"-":"-";
return moduleName;
}
console.log(day,hour,minute);

    let upcomingClasses=schedule.filter((classSch)=>{
        const [startHours, startMinutes] = classSch.startingTime.split(':').map(Number);

        return (classSch.day === day  || startHours >= hour || (startHours === hour ? startMinutes >= minute:true));
        });

console.log(upcomingClasses,classrooms);
if(loading.schedule){
    return(
        <Skeleton animation="pulse" sx={{ width:"max(55%,20rem,350px)",minHeight:200,WebkitTransform:"none"}} /> 
    )
}
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
            <>
                <ListItem id={c.id} sx={{display:"flex",margin:"0.4rem 0",flexWrap:"wrap",rowGap:"0.7rem",columnGap:"1.5rem",padding:"0.8rem",bgcolor:"Highlight",borderRadius:"0.3rem"}}>
                    <Typography component="span">
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Module
                        </Typography>
                        <Typography variant="body2">
                            {findName(c)}
                        </Typography>
                    </Typography>
                    <Typography component="span">
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Room
                    </Typography>
                    <Typography variant="body2">
                            {classrooms.filter((cl)=>cl.id === c.class)[0]?.name? classrooms.filter((cl)=>cl.id === c.class)[0].name:"-"}
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
                </>
            )}
        </List>
    </Card>
)
}
export default UpcomingClasses;