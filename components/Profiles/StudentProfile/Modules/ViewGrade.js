import { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, List, ListItem, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { Grade } from "@mui/icons-material";
export default function ViewGrade(probs) {
    let {grades,name}=probs;
    const [open, setOpen] = useState(false);
    const [value,setValue]=useState("1");
    const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };
      const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    return (
        <>
          <Button startIcon={<Grade/>} variant="outlined" onClick={handleClickOpen} sx={{width:"50%"}}>
            Grades
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth
           
          >
            <DialogTitle id="alert-dialog-title">
              {name} Grades
            </DialogTitle>
            <DialogContent  sx={{
                minHeight:"15rem !important"
            }}>
<Typography sx={{width:"100%",display:"flex",flexDirection:"row",}}> 
    <Typography sx={{flex:"1",fontFamily:"Graphik",color:"text.secondary"}}>
            Total Grade
    </Typography>
    <Typography sx={{fontFamily:"Graphik",color:"var(--styling1)"}}>
            0/50
    </Typography>
</Typography>
            <Box sx={{ width: '100%',minWidth:"25rem" }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider',overflow:"auto" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{minWidth:"25rem"}}>
          <Tab label="MidTerm" value="1" key="1"/>
          <Tab label="Labs" value="2" key="2"/>
          <Tab label="Project" value="3" key="3"/>
          <Tab label="Online Assignments" value="4" key="4"/>
          <Tab label="Onsight Assignments" value="5" key="5"/>
          <Tab label="Reports" value="6" key="6"/>          
        </Tabs>
      </Box>
      {(value === "1") &&  <Card sx={{width:"100%",boxShadow:"3"}}>
                    <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Midterm Grade
        </Typography>
        <Typography variant="h5" component="div">
          0/10
        </Typography>
        </CardContent>
        </Card>}
    </Box>
    
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
}