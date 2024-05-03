import { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, List, ListItem, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { Grade } from "@mui/icons-material";
import { useQuery } from "react-query";
import { get_assesments_grade, get_module_assesments, get_student_assesments_grade } from "../../../../store/getandset";
import { auth } from "../../../../store/fire";
export default function ViewGrade(probs) {
    let {name,module}=probs;
    const [open, setOpen] = useState(false);
    const [value,setValue]=useState("1");
    const moduleAssesmentPromise=()=>get_module_assesments(module.id);
    const {
      data: moduleAssesments=[],
      isLoading:isLoadingAssesments,
      error:iserror3,
    isFetching:isFetching3, 
     refetch:refetch3
    } = useQuery(`module:${module.id}`, moduleAssesmentPromise, {
     enabled:( open ),
      refetchOnWindowFocus:false,
    
      select:(data)=>{
          return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
      }
    }
    );
    const gradepromise=()=>get_student_assesments_grade(moduleAssesments,auth.currentUser.uid);
      const {
        data:assesmentsGrades=[],
        isLoading:isLoadingGrades,
        error:iserror2,
      isFetching:isFetching2, 
       refetch:refetch2
      } = useQuery(`module:${moduleAssesments}student:${auth.currentUser.uid}`, gradepromise, {
       enabled:( open && moduleAssesments.length > 0 ),
        refetchOnWindowFocus:false,
      
        select:(data)=>{
            return data ? data.docs.map((doc)=>({...doc.data(),docid:doc.id})) :[]
        }
      })
      console.log(assesmentsGrades,moduleAssesments);
    const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };
      const handleChange = (event, newValue) => {
        setValue(newValue);
      };
        let midterm=0,labs=0,onlineAssignments=0,project=0,onsightAssignments=0,quizes=0,reports=0;
        moduleAssesments.filter((m)=>m.type === "AssesmentOnline").map((as)=>{
          assesmentsGrades.filter((asg)=>((asg.assessmentId=== as.id))).map((asgm)=>onlineAssignments+=asgm.grade);
        });
        moduleAssesments.filter((m)=>m.type === "AssesmentMidTerm").map((as)=>{
          assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id)).map((asgm)=>midterm+=asgm.grade);
        });
        moduleAssesments.filter((m)=>m.type === "AssesmentLab").map((as)=>{
          assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id)).map((asgm)=>labs+=asgm.grade);
        });
        moduleAssesments.filter((m)=>m.type === "AssesmentOnsight").map((as)=>{
          assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id)).map((asgm)=>onsightAssignments+=asgm.grade);
        });
        moduleAssesments.filter((m)=>m.type === "AssesmentProject").map((as)=>{
          assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id)).map((asgm)=>project+=asgm.grade);
        });
        moduleAssesments.filter((m)=>m.type === "AssesmentQuizes").map((as)=>{
          assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id)).map((asgm)=>quizes+=asgm.grade);
        });
        moduleAssesments.filter((m)=>m.type === "AssesmentReports").map((as)=>{
          assesmentsGrades.filter((asg)=>(asg.assessmentId=== as.id)).map((asgm)=>reports+=asgm.grade);
        })   
        const checks={
          onlineAssignments:onlineAssignments>0?onlineAssignments:"",
          midterm:midterm>0?midterm:"",
          labs:labs>0?labs:"",
          onsightAssignments:onsightAssignments>0?onsightAssignments:"",
          project:project>0?project:"",
          quizes:quizes>0?quizes:"",
          reports:reports>0?reports:"",
        };
        let sum = 0;

// Iterate over values and add to sum
for (const key in checks) {
    if (checks.hasOwnProperty(key)) {
        const value = checks[key];
        if (typeof value === 'number') {
            sum += value;
        }
    }
}
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
            {sum}/50
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
          <Tab label="Reports" value="7" key="7"/>              
        </Tabs>
      </Box>
      {(value === "1") &&  <Card sx={{width:"100%",boxShadow:"3"}}>
                    <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Midterm Grade
        </Typography>
        <Typography variant="h5" component="div">
          {checks.midterm}/10
        </Typography>
        </CardContent>
        </Card>}
        {
          (value === "2") && <AssesmentsCards type={"AssesmentLab"} grades={assesmentsGrades} assesments={moduleAssesments}/>
        }
          {
          (value === "3") && <AssesmentsCards type={"AssesmentProject"} grades={assesmentsGrades} assesments={moduleAssesments}/>
        }
          {
          (value === "4") && <AssesmentsCards type={"AssesmentOnline"} grades={assesmentsGrades} assesments={moduleAssesments}/>
        }
          {
          (value === "5") && <AssesmentsCards type={"AssesmentOnsight"} grades={assesmentsGrades} assesments={moduleAssesments}/>
        }
          {
          (value === "6") && <AssesmentsCards type={"AssesmentReports"} grades={assesmentsGrades} assesments={moduleAssesments}/>
        }
          {
          (value === "7") && <AssesmentsCards type={"AssesmentQuizes"} grades={assesmentsGrades} assesments={moduleAssesments}/>
        }
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
function AssesmentsCards(props){
  const {type,assesments=[],grades=[]}=props;
  let typeAssesments=  assesments.filter((m)=>m.type === type);
  return(
    <>
    {
     typeAssesments.length ===0?<Typography color="text.secondary" textAlign="center" margin="0.8rem">No Assesments were Found!</Typography>
      :typeAssesments.map((t)=>(
        <Card sx={{width:"100%",boxShadow:"3",margin:"0.4rem 0rem"}}>
                    <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {t.title}
        </Typography>
        <Typography variant="h5" component="div">
          {grades.filter((g)=>g.assessmentId === t.id).length >0?
          grades.filter((g)=>g.assessmentId === t.id)[0].grade:"-"
          }/{t.grades}
        </Typography>
        </CardContent>
        </Card>
      ))
    }
    </>
  )
}