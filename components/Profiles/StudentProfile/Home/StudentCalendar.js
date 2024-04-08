import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Avatar, Badge, Card, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { PickersDay } from '@mui/x-date-pickers';
import { Assignment, QuestionAnswer, Quiz } from '@mui/icons-material';
import styled from '@emotion/styled';

export default function StudentCalendar(probs) {
let {quizes=[],midTerms=[],assignments=[],modules=[]}=probs;
const today= new AdapterDayjs;
const [todayActivities,setTodayActivities]=React.useState([]);
const [value,setValue]=React.useState(today.date());

console.log(value);
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar 
      sx={{bgcolor:"#fff",boxShadow:"1"}}
      value={value}
       slots={{
        day: specialDay,
      }}
      slotProps={{
        day: {
          quizes,midTerms,assignments,setValue,value,setTodayActivities,todayActivities
        },
      }}/>
    </LocalizationProvider>
    <List sx={{maxWidth:"100%",overflow:"auto",scrollbarColor:"transparent",display:"flex",flexDirection:"row",gap:"0.4rem"}}>
      {
        todayActivities.filter((act)=>act.date.getDay() === value.date() && act.date.getMonth() == value.month()).length === 0 ? <Typography color="text.secondary" textAlign="center" width="100%">No Activities</Typography>:""
      }
      {
        todayActivities.filter((act)=>act.date.getDay() === value.date() && act.date.getMonth() == value.month()).map(act=>(
          <ListItem key={act.title} sx={{width:"60%",minWidth:"250px",bgcolor:"#fff", borderRadius:"5px",boxShadow:"1"}}>
              <ListItemAvatar >
                <Avatar sx={{bgcolor:"#CCE4FB"}}>
                 {act.type === "assignment" ? <Assignment sx={{color:"var(--styling1)"}}/>: act.type==="quiz" ? <Quiz sx={{color:"var(--styling1)"}}/> :<QuestionAnswer sx={{color:"var(--styling1)"}}/>}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={act.title} secondary={modules.filter((mod)=>(mod.id === act.module))[0].name}/>
        
          </ListItem>
        ))
      }
    </List>
    </>
  );
}
function specialDay(props) {
    const {  day, outsideCurrentMonth,quizes,midTerms,assignments,setValue,value,setTodayActivities,todayActivities } = props;
    let isDateInAssignments;
    let isDateInMidTerms;
    let isDateInQuizes;
   isDateInQuizes = quizes.some(quiz => {if(quiz.date.getDay() === day.date() && quiz.date.getMonth() == day.month()){
    if(todayActivities.some((act)=>act.title === quiz.title)){
      return true;
    }
    setTodayActivities((prev)=>([...prev,{title:quiz.title,date:quiz.date,module:quiz.module,type:"quiz"}]));
    return true;
  }});
   isDateInAssignments = assignments.some(assign => {if(assign.date.getDay() === day.date() && assign.date.getMonth() == day.month())
    if(todayActivities.some((act)=>act.title === assign.title)){
      return true;
    }{
    setTodayActivities((prev)=>([...prev,{title:assign.title,date:assign.date,module:assign.module,type:"assignment"}]));
    return true;
  }
  });
   isDateInMidTerms = midTerms.some(midTerm => {if(midTerm.date.getDay() === day.date() && midTerm.date.getMonth() == day.month()){
    if(todayActivities.some((act)=>act.title === midTerm.title)){
      return true;
    }
    setTodayActivities((prev)=>([...prev,{title:midTerm.title,date:midTerm.date,module:midTerm.module,type:"midTerm"}]));
    return true;
  }
  
  });

let counter=0;
if(isDateInQuizes){
++counter;
console.log(counter);
}
if(isDateInMidTerms){
    ++counter;
    console.log(counter);
}
if(isDateInAssignments){
    counter++;
}
    return (
      <StyledBadge
        key={props.day.toString()}
        badgeContent={counter > 0 ? counter : undefined}
        color='info'
        overlap="circular"
      >
        <PickersDay sx={{border:"1px solid #fff",borderColor:(value.$D === day.$D && value.$M === day.$M)? "var(--styling1)":"",borderRadius:"50%"}} onDaySelect={(value)=>{setValue(value);console.log(value.$D);console.log(day.$D);}} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </StyledBadge>
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
  