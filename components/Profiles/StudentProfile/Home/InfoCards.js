import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const InfoCards=(probs)=>{
 let {attendancePercentage,lstWeekAttendPer,assginments,noModules}=probs;
 const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
 let attendanceComment=attendancePercentage >= lstWeekAttendPer ? `${attendancePercentage-lstWeekAttendPer}% higher than last week` : `${attendancePercentage-lstWeekAttendPer}% lower than last week`
    return(
        <Box sx={{width:"100%",maxWidth:"100%",height:"fit-content",display:"grid",gridTemplateColumns:isLargeScreen ? "1fr 1fr 1fr" : isSmallScreen ? "1fr ":"1fr 1fr",gap:"1rem"}}>
        <Card sx={{ width:"100%",minWidth: 275,height:"160px",color:"var(--styling1)",bgcolor:"#CCE4FB",fontFamily:"GraphikLight" }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 ,fontFamily:"GraphikLight"}}  gutterBottom>
            Attendance
          </Typography>
          <Typography fontFamily="Graphik" variant="h4" component="div" color="#4986D5" marginBottom={2}>
            {attendancePercentage}%
          </Typography>
          <Typography fontFamily="GraphikLight" variant="body2" >
            {attendanceComment}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ width:"100%",minWidth: 275,height:"160px",color:"var(--styling1)",bgcolor:"#CCE4FB" }}>
        <CardContent>
          <Typography fontFamily="GraphikLight" sx={{ fontSize: 14 }}  gutterBottom>
            Assginments
          </Typography>
          <Typography fontFamily="Graphik" variant="h4" component="div" color="#4986D5" marginBottom={2}>
            {assginments}
          </Typography>
          <Typography fontFamily="GraphikLight" variant="body2" >
            number of assginments to be done
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{width:"100%", minWidth: 275,height:"160px",color:"var(--styling1)",bgcolor:"#CCE4FB" }}>
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
      </Box>
    )
}
export default InfoCards;