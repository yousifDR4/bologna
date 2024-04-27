import { Calculate, Class, Laptop, LaptopOutlined, MoreVertRounded, Science } from "@mui/icons-material";
import { Box, Button, List, ListItem, ListItemText, ListSubheader, Menu, MenuItem, Popover, Typography } from "@mui/material";
import { useState } from "react";
const TodaySchedule=(probs)=>{
    const {modules,timeStart,timeEnd,classRooms,modulesList,professorModules=[]}=probs;
 const [startHours, startMinutes] = timeStart.split(':').map(Number);
 const [endHours,endMinutes]=timeEnd.split(':').map(Number);
 let numberOfRows=((endHours*60 + endMinutes)-(startHours*60 + startMinutes))/5 +6;
 function calculateRow(moduleStartingHour,ModuleStartMinute,moduleEndHours,moduleEndMinutes,minus){

    let rowNumber=(moduleStartingHour*60 + ModuleStartMinute)-(startHours*60 + startMinutes);
    let endRowNumber=(moduleEndHours*60 + moduleEndMinutes)-(moduleStartingHour*60+ModuleStartMinute);
    endRowNumber=(endRowNumber+rowNumber)/5;
    rowNumber=rowNumber/5;
    if(minus){
        rowNumber--;
        endRowNumber--;
    }
    return `${rowNumber+6}/${endRowNumber+6}`;
 }
 const now = new Date();
const day = now.getDay();
console.log(day);
let todayClasses=modules.filter((classSch)=>{
        return (classSch.day === day-1);
        });
 return(
    <Box sx={{boxSizing:"border-box",borderRadius:"10px",display:"grid",gridTemplateColumns:"10% 1fr",gridTemplateRows:`repeat(${numberOfRows},11px)`,bgcolor:"#fff",fontFamily:"GraphikLight",padding:"0.8rem",boxShadow:"1",maxWidth:"25rem",minWidth:"30rem"}}>
        {[...Array(+endHours- +startHours +1)].map((_, index) => (<><Box sx={{gridRow:`${calculateRow(startHours+index,startMinutes,startHours+index+1,startMinutes,true)}`,gridColumn:"1",}} color="text.secondary">{startHours+index}:{startMinutes}</Box>{[...Array(+endHours- +startHours +1)].map((_, secIndex)=>(<Box sx={{gridRow:`${calculateRow(startHours+index,startMinutes,startHours+index+1,startMinutes)}`,gridColumn:"2",borderTop:"1px dotted #B8BFC6"}}></Box>))}</>))
        }
        <Box sx={{gridRow:"1/6",gridColumn:"1/5",justifySelf:"left"}} color="text.secondary">Your schedule</Box>
        {
            todayClasses.map((mod)=>{
                const [modstartHours, modstartMinutes] = mod.startingTime.split(':').map(Number);
                const [modendHours,modendMinutes]=mod.endingTime.split(':').map(Number);
                return <Box sx={{gridRow:calculateRow(modstartHours,modstartMinutes,modendHours,modendMinutes,false),gridColumn:"2"}}><ModuleContainer module={mod} professorModules={professorModules} classrooms={classRooms} modules={modulesList}/></Box>
            })
        }
     
    </Box>
 )
}
export default TodaySchedule;
export const ModuleContainer=(probs)=>{
    let {module,modules,classrooms,professorModules}=probs;
    console.log(modules," nsjnkjnjcsnknjC");
    const [anchorEl, setAnchorEl] =useState(null);
    const [anchorMenu, setAnchorMenu] = useState(null);
  const openMenu = Boolean(anchorMenu);
  const handleMenuClose = () => {
    setAnchorMenu(null);
  };
    const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
      setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    console.log(professorModules,modules);
    let pModule=professorModules.filter((mod)=>(mod.id === module.module)).length >0 ?professorModules.filter((mod)=>(mod.id === module.module))[0]:[];
    let moduleName= pModule?.id ? modules.filter((m)=>m.id===pModule.module).length>0 ?modules.filter((m)=>m.id===pModule.module)[0].name:"-":"-";

    const bgColor=module.type === "Lab" ? "#F9F2F390": module.type === "Online" ? "#F9F4EB90":"#E8F2FB80";
    console.log(moduleName,pModule);
    const borderColor=module.type === "Lab" ? "#FE627495": module.type === "Online" ? "#FAB541":"#5983E8";
    const icon=module.type === "Lab" ? <Science sx={{color:"#FE627495",bgcolor:"#F7EAEB",width:"2rem",height:"2rem",borderRadius:"50%",padding:"0.18rem"}}/>: module.type === "Online" ? <Laptop sx={{color:"#FAB541",bgcolor:"#F9EEDB",width:"2rem",height:"2rem",borderRadius:"50%",padding:"0.18rem"}}/>:<Class sx={{color:"#5983E8",bgcolor:"#EAEEF8",width:"2rem",height:"2rem",borderRadius:"50%",padding:"0.2rem"}}/>;
    return (
      <Box sx={{bgcolor:bgColor,borderLeft:`5px solid ${borderColor}`,height:"98%",width:"100%",paddingLeft:"5px",}}>
        <Typography
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={!openMenu ? handlePopoverOpen:()=>{}}
          onMouseLeave={handlePopoverClose}
        >
          <Typography  sx={{display:"flex",flexWrap:"wrap",paddingTop:"0.5rem"}}>
            <Typography component="span" sx={{width:"80%"}}>
         <Typography variant="body1"> {moduleName}</Typography>
         <Typography component="span" sx={{flex:"1",color:borderColor}}>{module.startingTime + " - " + module.endingTime}</Typography>
         </Typography>
        {icon}
         </Typography>
        </Typography>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: module.day <7 ? "center":"left",
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography >
            <List sx={{padding:"0",margin:"0"}}  subheader={
        <ListSubheader component="div" id="nested-list-subheader" sx={{margin:"0 !important",paddingBottom:"0"}}>
          {moduleName}
        </ListSubheader>
      } >
                <ListItem sx={{paddingTop:"0",margin:"0"}}>
                    <ListItemText primary="classroom" secondary={classrooms.filter((c)=>c.id === module.class)[0]?.name? classrooms.filter((c)=>c.id === module.class)[0]?.name:"-"}/>
                </ListItem>
                <ListItem sx={{paddingTop:"0",margin:"0"}}>
                    <ListItemText primary="Type" secondary={module.type}/>
                </ListItem>
            </List>
          </Typography>
        </Popover>
      </Box>
    );
}