import { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, List, ListItem, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { Grade } from "@mui/icons-material";
import { useQueries, useQuery } from "react-query";
import { get_assesments_grade, get_module_assesments, get_module_students, get_students_grade } from "../../../../store/getandset";
import { useDispatch, useSelector } from "react-redux";
import { TableLoader } from "../../DepartmentProfile/Programs/ProgramModules/ProgramModulesTable";
export default function StudentGrades(probs) {
    let {grades,moduleName,module}=probs;
    const [open, setOpen] = useState(false);
    const [value,setValue]=useState("1");
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };
      const handleChange = (event, newValue) => {
        setValue(newValue);
      };
      const studentPromise=()=>get_module_students(Department_id,module.id);
      const {
        data: students=[],
        isLoading:isLoadingStudents,
        error:iserror,
      isFetching:isFetching, 
       refetch
      } = useQuery(`department:${Department_id}module:${module.id}`, studentPromise, {
       enabled:(!!Department_id && open ),
        refetchOnWindowFocus:false,
      
        select:(data)=>{
            return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
        }
      }
      );
      const moduleAssesmentPromise=()=>get_module_assesments(module.id);
      const {
        data: moduleAssesments=[],
        isLoading:isLoadingAssesments,
        error:iserror3,
      isFetching:isFetching3, 
       refetch:refetch3
      } = useQuery(`module:${module.id}`, moduleAssesmentPromise, {
       enabled:(!!Department_id && open ),
        refetchOnWindowFocus:false,
      
        select:(data)=>{
            return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
        }
      }
      );
      const gradepromise=()=>get_assesments_grade(moduleAssesments);
      const {
        data:assesmentsGrades=[],
        isLoading:isLoadingGrades,
        error:iserror2,
      isFetching:isFetching2, 
       refetch:refetch2
      } = useQuery(`module:${moduleAssesments}`, gradepromise, {
       enabled:( open && moduleAssesments.length > 0 ),
        refetchOnWindowFocus:false,
      
        select:(data)=>{
            return data ? data.docs.map((doc)=>({...doc.data(),docid:doc.id})) :[]
        }
      })
      console.log(assesmentsGrades,moduleAssesments,students);
    return (
        <>
          <Button startIcon={<Grade/>}  variant="outlined" onClick={handleClickOpen} sx={{width:"48%"}}>
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
              {moduleName} Grades
            </DialogTitle>
            <DialogContent  sx={{
                minHeight:"15rem !important"
            }}>
            <Box sx={{ width: '100%',minWidth:"25rem" }}>
                <GradesTable isLoading={isLoadingAssesments || isLoadingGrades || isLoadingStudents} assesmentsGrades={assesmentsGrades} moduleAssesments={moduleAssesments} students={students}/>
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


const columns = [
  {
    field: 'name',
    headerName: 'Student Name',
    width: 200,
  },
  {
    field: 'Division',
    headerName: 'Student Division',
    width: 150,
  },
  {
    field: 'midterm',
    headerName: 'Midterm',
    width: 130,
  },
  {
    field: 'labs',
    headerName: 'Labs',
    width: 130,
  },
  {
    field: 'onlineAssignments',
    headerName: 'Online Assignments',
    width: 130,
  },
  {
    field: 'project',
    headerName: 'Project',
    width: 130,
  },
  {
    field: 'onsightAssignments',
    headerName: 'Onsight Assignments',
    width: 130,
  },
  {
    field: 'reports',
    headerName: 'Reports',
    width: 130,
  },
  {
    field: "quizes",
    headerName: "Quizes",
    width:130,
    type:"number"
  },
  {
    field: 'totalGrade',
    headerName: 'Total Grade',
    width: 130,
    valueGetter: (params) =>
    (+params.row.midterm || 0) + (+params.row.labs || 0) + (+params.row.onlineAssignments || 0) + (+params.row.project || 0 ) + (+params.row.onsightAssignments || 0 ) + (+params.row.reports || 0 ),
  },
];

const rows = [
{id:"01",name:"ahmed",midterm:5,labs:0,project:4,onsightAssignments:6,reports:3}
];
export function GradesTable(probs) {
    const [Grades,setGrades]=useState(rows);
    const {isLoading,assesmentsGrades=[], moduleAssesments=[], students=[]}=probs;
    let modRows=students.map((s)=>{
      let midterm=0,labs=0,onlineAssignments=0,project=0,onsightAssignments=0,quizes=0,reports=0;
      moduleAssesments.filter((m)=>m.type === "AssesmentOnline").map((as)=>{
        assesmentsGrades.filter((asg)=>asg.assessmentId=== as.id).map((asgm)=>onlineAssignments+=asgm.grade);
      });
      moduleAssesments.filter((m)=>m.type === "AssesmentMidTerm").map((as)=>{
        assesmentsGrades.filter((asg)=>asg.assessmentId=== as.id).map((asgm)=>midterm+=asgm.grade);
      });
      moduleAssesments.filter((m)=>m.type === "AssesmentLab").map((as)=>{
        assesmentsGrades.filter((asg)=>asg.assessmentId=== as.id).map((asgm)=>labs+=asgm.grade);
      });
      moduleAssesments.filter((m)=>m.type === "AssesmentOnsight").map((as)=>{
        assesmentsGrades.filter((asg)=>asg.assessmentId=== as.id).map((asgm)=>onsightAssignments+=asgm.grade);
      });
      moduleAssesments.filter((m)=>m.type === "AssesmentProject").map((as)=>{
        assesmentsGrades.filter((asg)=>asg.assessmentId=== as.id).map((asgm)=>project+=asgm.grade);
      });
      moduleAssesments.filter((m)=>m.type === "AssesmentQuizes").map((as)=>{
        assesmentsGrades.filter((asg)=>asg.assessmentId=== as.id).map((asgm)=>quizes+=asgm.grade);
      });
      moduleAssesments.filter((m)=>m.type === "AssesmentReports").map((as)=>{
        assesmentsGrades.filter((asg)=>asg.assessmentId=== as.id).map((asgm)=>reports+=asgm.grade);
      });
      const checks={
        onlineAssignments:onlineAssignments>0?onlineAssignments:"",
        midterm:midterm>0?midterm:"",
        labs:labs>0?labs:"",
        onsightAssignments:onsightAssignments>0?onsightAssignments:"",
        project:project>0?project:"",
        quizes:quizes>0?quizes:"",
        reports:reports>0?reports:""
      };
      return {...s,name:s.firstname+" "+s.lastname,...checks}
    })
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      {isLoading ? <TableLoader/>:
      <DataGrid 
      sx={{ height: "400", bgcolor:"#fff",width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}
        rows={modRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
}
    </Box>
  );
}