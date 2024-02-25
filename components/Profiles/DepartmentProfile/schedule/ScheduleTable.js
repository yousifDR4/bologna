import { Calculate, Class, Laptop, LaptopOutlined, MoreVertRounded, Science } from "@mui/icons-material";
import { Box, Button, List, ListItem, ListItemText, ListSubheader, Menu, MenuItem, Popover, Typography } from "@mui/material";
import { useState } from "react";
import AddScheduling from "./AddScheduling";
let arr=[
    "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
];
const ScheduleTable=(probs)=>{
 const {modules,timeStart,timeEnd,classRooms,modulesList}=probs;
 const [startHours, startMinutes] = timeStart.split(':').map(Number);
 const [endHours,endMinutes]=timeEnd.split(':').map(Number);
 let numberOfRows=((endHours*60 + endMinutes)-(startHours*60 + startMinutes))/5 +6;
 function calculateRow(moduleStartingHour,ModuleStartMinute,moduleEndHours,moduleEndMinutes,minus){

    let rowNumber=(moduleStartingHour*60 + ModuleStartMinute)-(startHours*60 + startMinutes);
    let endRowNumber=(moduleEndHours*60 + moduleEndMinutes)-(moduleStartingHour*60+ModuleStartMinute);
    endRowNumber=(endRowNumber+rowNumber)/5;
    rowNumber=rowNumber/5;
    console.log(moduleStartingHour,ModuleStartMinute,moduleEndHours,moduleEndMinutes);
    console.log(endRowNumber,rowNumber);
    if(minus){
        rowNumber--;
        endRowNumber--;
    }
    return `${rowNumber+6}/${endRowNumber+6}`;
 }
 return(
    <Box sx={{width:"100%",borderRadius:"10px",maxWidth:"100%",boxSizing:"border-box",display:"grid",gridTemplateColumns:"0.5fr repeat(7,1fr)",gridTemplateRows:`repeat(${numberOfRows},11px)`,bgcolor:"#fff",fontFamily:"GraphikLight",padding:"0.8rem",marginTop:"0.8rem",minWidth:"70rem"}}>
        {[...Array(+endHours- +startHours +1)].map((_, index) => (<><Box sx={{gridRow:`${calculateRow(startHours+index,startMinutes,startHours+index+1,startMinutes,true)}`,gridColumn:"0",}}>{startHours+index}:{startMinutes}</Box>{[...Array(+endHours- +startHours +1)].map((_, secIndex)=>(<Box sx={{gridRow:`${calculateRow(startHours+index,startMinutes,startHours+index+1,startMinutes)}`,gridColumn:secIndex+2,borderTop:"1px dotted #B8BFC6"}}></Box>))}</>))
        }
        {[...Array(7)].map((_, index) => (<Box sx={{gridRow:"1/6",gridColumn:index+2,justifySelf:"center"}}>{arr[index]}</Box>))
        }
        {
            modules.map((mod)=>{
                const [modstartHours, modstartMinutes] = mod.startingTime.split(':').map(Number);
                const [modendHours,modendMinutes]=mod.endingTime.split(':').map(Number);
                return <Box sx={{gridRow:calculateRow(modstartHours,modstartMinutes,modendHours,modendMinutes,false),gridColumn:mod.day+1}}><ModuleContainer module={mod} classrooms={classRooms} modules={modulesList}/></Box>
            })
        }
     
    </Box>
 )
}
export default ScheduleTable;

export const ModuleContainer=(probs)=>{
    let {module,modules,classrooms}=probs;
    const [anchorEl, setAnchorEl] =useState(null);
    const [anchorMenu, setAnchorMenu] = useState(null);
  const openMenu = Boolean(anchorMenu);
  const handleMenuClick = (event) => {
    setAnchorMenu(event.currentTarget);
    if(open)
    setAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorMenu(null);
  };
    const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
      setAnchorEl(null);
    };
  const handleDelete=()=>{
    //module.id delete
    handleMenuClose();
  }
    const open = Boolean(anchorEl);
    const bgColor=module.type === "Lab" ? "#F9F2F390": module.type === "Online" ? "#F9F4EB90":"#E8F2FB80";
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
          <Typography  sx={{display:"flex"}}>
            <Typography sx={{flex:"1"}}></Typography>
            <>
            <Button
        id="basic-button"
        aria-controls={openMenu ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        onClick={handleMenuClick}
        sx={{
          width:"fit-content",
          padding:"0",
          margin:"0",
          minWidth:"fit-content",
          '&:hover': {
            border:"none",
            bgcolor:"transparent"
        },
        }}
      >
        <MoreVertRounded/>
      </Button>
            <Menu
        id="basic-menu"
        anchorEl={anchorMenu}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem ><AddScheduling edit={true} modules={modules} initialValues={module} classes={classrooms} study={module.study}/></MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu></>
          </Typography>
          <Typography  sx={{display:"flex",flexWrap:"wrap"}}>
            <Typography component="span" sx={{width:"80%"}}>
         <Typography variant="body1"> {modules.filter((mod)=>(mod.id === module.moduleId))[0]?.name}</Typography>
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
          {modules.filter((mod)=>(mod.id === module.moduleId))[0].name}
        </ListSubheader>
      } >
                <ListItem sx={{paddingTop:"0",margin:"0"}}>
                    <ListItemText primary="classroom" secondary={classrooms.filter((c)=>c.id === module.classroomId)[0].name}/>
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