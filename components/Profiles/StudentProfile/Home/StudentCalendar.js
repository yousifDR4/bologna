import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Avatar, Badge, Card, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, ListSubheader, Popover, Typography } from '@mui/material';
import { PickersDay } from '@mui/x-date-pickers';
import { Assignment, QuestionAnswer, Quiz } from '@mui/icons-material';
import styled from '@emotion/styled';

export default function StudentCalendar(probs) {
let {quizes=[],assesments=[],loading,professorModules=[],modules=[]}=probs;
const today= new AdapterDayjs;
const [todayActivities,setTodayActivities]=React.useState([]);
const [value,setValue]=React.useState(today.date());
const [anchorEls, setAnchorEls] = React.useState(Array(todayActivities.filter((act) => act.D === value.$D && act.M == value.$M).length).fill(null));
console.log(anchorEls);
const handlePopoverOpen = (event, index) => {
  const newAnchorEls = Array(todayActivities.filter((act) => act.D === value.$D && act.M == value.$M).length).fill(null);
  newAnchorEls[index] = event.currentTarget;
  setAnchorEls(newAnchorEls);
};
React.useEffect(()=>{
  setAnchorEls(Array(todayActivities.filter((act) => act.D === value.$D && act.M == value.$M).length).fill(null));
},[todayActivities]);
const handlePopoverClose = (index) => {
  const newAnchorEls = [...anchorEls];
  newAnchorEls[index] = null;
  setAnchorEls(newAnchorEls);
};
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar 
      loading={loading.assesments}
      sx={{bgcolor:"#fff",boxShadow:"1"}}
      value={value}
       slots={{
        day: specialDay,
      }}
      slotProps={{
        day: {
          quizes,assesments,setValue,value,setTodayActivities,todayActivities,
        },
      }}
      />
    </LocalizationProvider>
    <List sx={{ maxWidth: "100%", overflow: "auto", scrollbarColor: "transparent", display: "flex", flexDirection: "row", gap: "0.4rem" }}>
      {todayActivities.filter((act) => act.D === value.$D && act.M == value.$M).length === 0 ? <Typography color="text.secondary" textAlign="center" width="100%">No Activities</Typography> : ""}
      {todayActivities.filter((act) => act.D === value.$D && act.M == value.$M).map((act, index) => (
        <>
          <ListItem
            key={act.title}
            aria-owns={anchorEls[index] ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={(event) => handlePopoverOpen(event, index)}
            onMouseLeave={() => handlePopoverClose(index)}
            sx={{
              width: "60%",
              minWidth: "250px",
              bgcolor: "#fff",
              borderRadius: "5px",
              boxShadow: "1"
            }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "#CCE4FB" }}>
                {act.type === "AssesmentOnsight" || act.type === "AssesmentOnline" ? <Assignment sx={{ color: "var(--styling1)" }} /> : act.type === "AssesmentQuizes" ? <Quiz sx={{ color: "var(--styling1)" }} /> : <QuestionAnswer sx={{ color: "var(--styling1)" }} />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={act.title} secondary={modules.filter((mod) => professorModules.filter((m) => (m.id === act.module))[0].module === mod.id)[0].name} />
          </ListItem>
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: 'none',
            }}
            open={anchorEls[index]?anchorEls[index] !== null:false}
            anchorEl={anchorEls[index]}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={() => handlePopoverClose(index)}
            disableRestoreFocus
          >
            <Typography>
              <List sx={{ padding: "0", margin: "0" }} subheader={
                <ListSubheader component="div" id="nested-list-subheader" sx={{ margin: "0 !important", paddingBottom: "0" }}>
                  {}
                </ListSubheader>
              } >
                <ListItem sx={{ paddingTop: "0", margin: "0" }}>
                  <ListItemText primary="mark" secondary={act.grades} />
                </ListItem>
                <ListItem sx={{ paddingTop: "0", margin: "0" }}>
                  <ListItemText primary="Type" secondary={act.type} />
                </ListItem>
                <ListItem sx={{ paddingTop: "0", margin: "0" }}>
                  <ListItemText primary="notes" secondary={act.notes} />
                </ListItem>
              </List>
            </Typography>
          </Popover>
        </>
      ))}
    </List>
    </>
  );
}
function specialDay(props) {
    const {  day, outsideCurrentMonth,assesments,setValue,value,setTodayActivities,todayActivities,...all } = props;
    let isDateInAssesments;
    let counter=todayActivities.filter((assign)=> assign.D === day.$D && assign.M == day.$M).length;
    assesments.map(assign => {
    if(assign.D === day.$D && assign.M == day.$M){
    if(todayActivities.some((act)=>act.id === assign.id)){
      return;
    }
    else{
    setTodayActivities((prev)=>([...prev,{...assign}]));
  
    return true;
  }
}
  });



    return (
      <StyledBadge
        key={props.day.toString()}
        badgeContent={counter > 0 ? counter : undefined}
        color='info'
        overlap="circular"
      >
     <PickersDay  sx={{border:"1px solid #fff",borderColor:(value.$D === day.$D && value.$M === day.$M)? "var(--styling1)":"",borderRadius:"50%"}} onDaySelect={(value)=>{setValue(value);}}  outsideCurrentMonth={outsideCurrentMonth} day={day} />      </StyledBadge>
    );
  }const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 5,
      top: 10,
      padding: '0 4px',
      minWidth:"1px",
      minHeight:"1px",
      height:"11px",
      width:"11px",
      fontSize:"10px"
    },
  }));
  