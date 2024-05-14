import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, List, ListItem, ListItemText, MenuItem, Tab, Tabs, Typography } from "@mui/material";
import { Grade, Person2Outlined } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useQueries, useQuery } from "react-query";
import { get_module_students, get_students_grade,get_students_Attendance_byModule, get_active_modules, get_progs } from "../../../../store/getandset";
import { useDispatch, useSelector } from "react-redux";
import { TableLoader } from "../../DepartmentProfile/Programs/ProgramModules/ProgramModulesTable";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../store/fire";
import { displayMessage } from "../../../../store/message-slice";
export default function StudentAttendanceTable(probs) {
    const {students=[],attendances=[],module={},loading,refetch}=probs;
    const [showSelectionAction,setShowSelectionAction]=useState(false);
    console.log(attendances,students);
    const [selectedStudent,setSelectedStudents]=useState([]);
    const [uploading,setUploading]=useState(false);
    console.log(selectedStudent);
    const [rowModesModel, setRowModesModel] = useState({});
    const dispatch=useDispatch();
    const selectedAttendance = attendances.reduce((accumulator, currentValue) => {
      // Check if the lecture already exists in the accumulator
      const existingLecture = accumulator.find(item => (item.D === currentValue.D && item.M === currentValue.M));
      if (!existingLecture) {
          // If the lecture doesn't exist, add the current attendance object to the accumulator
          accumulator.push(currentValue);
      }
      return accumulator;
  }, []);
  let numOfHours=0;
  selectedAttendance.map((s)=>{
    numOfHours+=s.fullhours;
  })
      let rows= students.map((s)=>({...s,name:s.firstname+" "+s.lastname}));
     rows=rows.map((row)=>{
  if (attendances===0) {
    return {...row}
  }
      const StudentsAttendance=attendances.filter((attendance)=>row.id===attendance.studentId);
      let attendedHours=0,absentHours=0,failed=false;
      StudentsAttendance.map((st)=>{
        if(st.attended){
          attendedHours+=st.attendedHours;
        }
        else{
          absentHours+=st.fullhours;
        }
      });
      if(absentHours >= (0.14*(module.ECTS * 25))){
        failed=true;
      }
        return{...row,attendedHours:attendedHours,absentHours:absentHours,failed:failed,
  
        }
     });
    //  const handleRowEditStop = (params, event) => {
    //     if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    //       event.defaultMuiPrevented = true;
    //     }
    //   };
    
    //   const handleEditClick = (id) => () => {
    //     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    //   };
    
    //   const handleSaveClick = (id) => () => {
    //     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    //   };
    
    //   const handleDeleteClick = (id) => () => {
    //   };
    //   const handleCancelClick = (id) => () => {
    //     setRowModesModel({
    //       ...rowModesModel,
    //       [id]: { mode: GridRowModes.View, ignoreModifications: true },
    //     });
    
    //     const editedRow = rows.find((row) => row.id === id);
    //     if(editedRow?.isNew)
    //     if (editedRow.isNew) {
    //       setRows(rows.filter((row) => row.id !== id));
    //     }
    //   };
    //   const handleProcessRowUpdateError = React.useCallback((error) => {
    //     dispatch(displayMessage("Value must be valid","error"));
    //   })
    //   const processRowUpdate = async(newRow) => {
    //   };
    
    //   const handleRowModesModelChange = (newRowModesModel) => {
    //     setRowModesModel(newRowModesModel);
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
      field: 'attendedHours',
      headerName: `Attended Hours/${numOfHours}`,
      width: 200,
    },
    {
      field: 'absentHours',
      headerName: 'Absense Hours',
      width: 200,
    },
    {
      field: 'failed',
      headerName: 'Failed by Attendance',
      type:"boolean",
      width: 200,
    },
    
  ];

  const RemoveStudents = async (ids = []) => {
    setUploading(true);
    try {
      const promises = ids.map(async (id) => {
        try {
          console.log("Processing for ID:", id);
          await setDoc(doc(db, "users", id), {
            failedModules: arrayUnion(module.id),
            registerdModules: rows
              .filter((r) => r.id === id)[0]
              .registerdModules.filter(
                (e) => e !==module.id
              ),
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
  
  async function handleRemoveAllStudents(){
    let failedStu=rows.filter((s)=>s.failed);
    let ids=[];
    failedStu.map((s)=>ids.push(s.id));

    await RemoveStudents(ids);
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
        //   rowModesModel={rowModesModel}
        //   onRowModesModelChange={handleRowModesModelChange}
        //   onRowEditStop={handleRowEditStop}
        //   processRowUpdate={processRowUpdate}
        //   onProcessRowUpdateError={handleProcessRowUpdateError}

        />
  }
       <Button variant='outlined' onClick={handleRemoveAllStudents} disabled={!rows.some((row)=>row?.failed?row.failed:false) || uploading} sx={{width:"25rem",marginTop:"0.5rem"}}>Remove all students failed by attendance</Button>
      {showSelectionAction && <Button variant='outlined' onClick={()=>RemoveStudents(selectedStudent)} disabled={!rows.filter((r)=>selectedStudent.includes(r.id)).every((row)=>row?.failed?row.failed:false) || uploading} sx={{width:"20rem",marginLeft:"0.5rem",marginTop:"0.5rem"}}>Remove Selected Students</Button>}

      </Box>
    );
  }
