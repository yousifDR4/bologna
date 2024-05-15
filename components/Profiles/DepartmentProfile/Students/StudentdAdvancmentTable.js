import { useEffect, useState } from "react";
import { DataGrid, GridActionsCell, GridActionsCellItem } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, Link, List, ListItem, ListItemText, MenuItem, Tab, Tabs, Typography } from "@mui/material";
import { Grade, Person2, Person2Outlined } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useQueries, useQuery } from "react-query";
import { get_module_students, get_students_grade,get_students_Attendance_byModule, get_active_modules, get_progs } from "../../../../store/getandset";
import { useDispatch, useSelector } from "react-redux";
import { TableLoader } from "../../DepartmentProfile/Programs/ProgramModules/ProgramModulesTable";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../store/fire";
import { displayMessage } from "../../../../store/message-slice";
import { useNavigate } from "react-router-dom";
export default function StudentAdvancementTable(probs) {
    const {students=[],loading,refetch,program}=probs;
    const [showSelectionAction,setShowSelectionAction]=useState(false);
    const [selectedStudent,setSelectedStudents]=useState([]);
    const [uploading,setUploading]=useState(false);
    const navigate=useNavigate();
    console.log(selectedStudent);
    const [rowModesModel, setRowModesModel] = useState({});
    const dispatch=useDispatch();
      let rows= students.map((s)=>({...s,name:s.firstname+" "+s.lastname,secNum:s?.secondTryModules?s.secondTryModules.length:0,
    passNum:s?.passedModules?s.passedModules.length:0,
    failedNum:s?.failedModules?s.failedModules.length:0,
    semester:s?.semester?s.semester:1
    }));
    //   };
     const columns = [
      {
          field: 'id',
          headerName: 'Student ID',
          width: 200,
        },
    {
      field: 'name',
      headerName: 'Student Name',
      width: 200,
    },
    {
      field: 'level',
      headerName: 'Student Level',
      width: 140,
      type:"number",

    },
    {
      field: 'semester',
      headerName: 'Student Semester',
      width: 140,
      type:"number",

    },
    {
      field: 'passNum',
      headerName: `Passed Modules`,
      width: 200,
      type:"number",

    },
    {
      field: 'failedNum',
      headerName: 'Failed Modules',
      width: 200,
      type:"number",

    },
    {
      field: 'secNum',
      headerName: 'Second Attempt Modules',
      type:"number",
      width: 200,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 130,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<Link sx={{color:"#000"}} href={`/ViewStudentProfile?id=${id}`} target="_blank"><Person2 /></Link>}
            label="Visit Profile"
            title="Visit Profile"
            className="textPrimary"
          
            color="inherit"
          />,
        ];
      },
    },
    
  ];

  const moveToSecondSemester = async (ids = []) => {
    setUploading(true);
    try {
      const promises = ids.map(async (id) => {
        try {
          console.log("Processing for ID:", id);
          await setDoc(doc(db, "users", id), {
            registerdModules: [],
            semester:2,
          }, { merge: true });
          console.log("Processed for ID:", id);
        } catch (e) {
          console.log("Error for ID:", id, e);
          // If you want to handle errors for each ID separately, you can throw the error here
          // throw e;
        }
      });
  
      await Promise.all(promises);
      dispatch(displayMessage("Students were Removed Successfully!"));
       refetch();
      setUploading(false);
      console.log("All IDs processed successfully");
    } catch (error) {
      dispatch(displayMessage(`An error occurred while processing student ${error}`,"error"))
      console.error("Error processing IDs:", error);
       refetch();
      setUploading(false);
    }
    finally{
      console.log("nankjeaj");
   
    }
  };
  
  async function handleMovetoSecondSemsterAllStudents(){
    let ids=[];
    students.map((s)=>ids.push(s.id));

    await moveToSecondSemester(ids);
  }
  const moveToNextYear = async (ids = []) => {
    setUploading(true);
    try {
      const promises = ids.map(async (id) => {
        try {
          console.log("Processing for ID:", id);
          if(students.filter((s)=>s.id===id)[0].level+1>program.type){
            throw new Error("An error occurred, maximum students' level reached!");
          }
          await setDoc(doc(db, "users", id), {
            registerdModules: [],
            level:students.filter((s)=>s.id===id)[0].level+1,
            semester:1
          }, { merge: true });
          console.log("Processed for ID:", id);
        } catch (e) {
          console.log("Error for ID:", id, e);
        }
      });
  
      await Promise.all(promises);
      dispatch(displayMessage("Students were advanced Successfully!"));
       refetch();
      setUploading(false);
      console.log("All IDs processed successfully");
    } catch (error) {
      dispatch(displayMessage(`${error}`,"error"))
      console.error("Error processing IDs:", error);
       refetch();
      setUploading(false);
    }
    finally{
      console.log("nankjeaj");
   
    }
  };
  
  async function handleMovetoNextLevelAllStudents(){
    let ids=[];
    students.map((s)=>ids.push(s.id));

    await moveToNextYear(ids);
  }
    return (
      <Box sx={{ height: 400, width: '100%' }}>
       {loading?<TableLoader/>: <DataGrid 
        sx={{ height: "400", bgcolor:"#fff",width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}
          rows={rows}
        //   editMode="row"
          columns={columns}
          rowSelection
          checkboxSelection
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5,10,20]}
          onRowSelectionModelChange={(id)=>{if(id.length === 0){setShowSelectionAction(false)}else{setShowSelectionAction(true)}setSelectedStudents(id);}}
        />
  }
       <Button variant='outlined' onClick={handleMovetoSecondSemsterAllStudents} disabled={rows.length <1 || uploading} sx={{width:"25rem",marginLeft:"0.5rem",marginTop:"0.5rem"}}>Advance all students to the next semester</Button>
       <Button variant='outlined' onClick={handleMovetoNextLevelAllStudents} disabled={rows.length <1|| uploading} sx={{width:"25rem",marginLeft:"0.5rem",marginTop:"0.5rem"}}>Advance all students to the next level</Button>
      {showSelectionAction && <Button variant='outlined' onClick={()=>moveToSecondSemester(selectedStudent)} disabled={selectedStudent.length <1|| uploading} sx={{width:"25rem",marginLeft:"0.5rem",marginTop:"0.5rem"}}>Advance  to the next semester</Button>}
      {showSelectionAction && <Button variant='outlined' onClick={()=>moveToNextYear(selectedStudent)} disabled={selectedStudent.length <1|| uploading} sx={{width:"25rem",marginLeft:"0.5rem",marginTop:"0.5rem"}}>Advance  to the next level</Button>}

      </Box>
    );
  }
