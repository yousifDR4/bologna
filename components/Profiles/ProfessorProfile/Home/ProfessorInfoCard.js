import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Skeleton } from '@mui/material';
import { getWeekdays } from '@mui/x-date-pickers/internals/utils/date-utils';

const ProfessorInfoCards=(probs)=>{
 let {attendancePercentage,lstWeekAttendPer,students,noModules,loading,assesments}=probs;
 const theme = useTheme();
 const today=new Date();
 let modAss=assesments.map((as)=>({...as,date:new Date(as.y,as.M,as.D)}));
 console.log(modAss);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
 let attendanceComment=attendancePercentage >= lstWeekAttendPer ? `${attendancePercentage-lstWeekAttendPer}% higher than last week` : `${attendancePercentage-lstWeekAttendPer}% lower than last week`
    return(
        <Box sx={{width:"100%",maxWidth:"100%",height:"fit-content",display:"grid",gridTemplateColumns:isLargeScreen ? "1fr 1fr 1fr" : isSmallScreen ? "1fr ":"1fr 1fr",gap:"1rem"}}>
      <Card sx={{ width:"100%",minWidth: 275,height:"160px",color:"var(--styling1)",bgcolor:"#CCE4FB",fontFamily:"GraphikLight" }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 ,fontFamily:"GraphikLight"}}  gutterBottom>
            Assesments
          </Typography>
          <Typography fontFamily="Graphik" variant="h4" component="div" color="#4986D5" marginBottom={2}>
            {modAss.filter((as)=>as.date.getWeek()===(today.getWeek())).length}
          </Typography>
          <Typography fontFamily="GraphikLight" variant="body2" >
            Number of assesments for this week
          </Typography>
        </CardContent>
      </Card>
      {loading.students ? <Skeleton animation="pulse" sx={{ width:"100%",minWidth: 275,height:"160px",WebkitTransform:"none"}} />  :<Card sx={{ width:"100%",minWidth: 275,height:"160px",color:"var(--styling1)",bgcolor:"#CCE4FB" }}>
        <CardContent>
          <Typography fontFamily="GraphikLight" sx={{ fontSize: 14 }}  gutterBottom>
            Students
          </Typography>
          <Typography fontFamily="Graphik" variant="h4" component="div" color="#4986D5" marginBottom={2}>
            {students}
          </Typography>
          <Typography fontFamily="GraphikLight" variant="body2" >
            number of students you teach
          </Typography>
        </CardContent>
      </Card>
    }
     {loading.noModules ? <Skeleton animation="pulse" sx={{ width:"100%",minWidth: 275,height:"160px",WebkitTransform:"none"}} />: <Card sx={{width:"100%", minWidth: 275,height:"160px",color:"var(--styling1)",bgcolor:"#CCE4FB" }}>
        <CardContent>
          <Typography fontFamily="GraphikLight" sx={{ fontSize: 14 }}  gutterBottom>
            Modules
          </Typography>
          <Typography fontFamily="Graphik" variant="h4" component="div" color="#4986D5" marginBottom={2}>
            {noModules}
          </Typography>
          <Typography fontFamily="GraphikLight" variant="body2" >
            number of modules in this semester
          </Typography>
        </CardContent>
      </Card>
}
      </Box>
    )
}
export default ProfessorInfoCards;
Date.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
  
      dowOffset = typeof(dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
      var newYear = new Date(this.getFullYear(),0,1);
      var day = newYear.getDay() - dowOffset; //the day of week the year begins on
      day = (day >= 0 ? day : day + 7);
      var daynum = Math.floor((this.getTime() - newYear.getTime() - 
      (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
      var weeknum;
      //if the year starts before the middle of a week
      if(day < 4) {
          weeknum = Math.floor((daynum+day-1)/7) + 1;
          if(weeknum > 52) {
             let nYear = new Date(this.getFullYear() + 1,0,1);
             let nday = nYear.getDay() - dowOffset;
              nday = nday >= 0 ? nday : nday + 7;
              /*if the next year starts before the middle of
                the week, it is week #1 of that year*/
              weeknum = nday < 4 ? 1 : 53;
          }
      }
      else {
          weeknum = Math.floor((daynum+day-1)/7);
      }
      return weeknum;
  };