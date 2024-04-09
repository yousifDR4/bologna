import { useState } from "react";
import {   GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons, } from '@mui/x-data-grid';import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, CardContent, List, ListItem, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { Cancel, Edit, Grade, Group, GroupOutlined, RateReview, Save, StarRounded } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { messageActions } from "../../../store/message-slice";
export default function AssesmentGradesTable(probs) {
    let {moduleName,students,assesment}=probs;
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };
    return (
        <>
          <Button startIcon={<StarRounded/>}  sx={{'&:hover':{bgcolor:"#a2d0fb !important",border:"none"},bgcolor:"#add5fb !important",width:"50%",boxShadow:"none"}} variant="contained" onClick={handleClickOpen}>
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
             Students' {assesment.title || "-"} Grades 
            </DialogTitle>
            <DialogContent  sx={{
                minHeight:"15rem !important"
            }}>
            <Box sx={{ width: '100%',minWidth:"25rem" }}>
                <StudentsTable students={students} assesment={assesment} module={module}/>
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





export function StudentsTable(probs) {
    const {assesment,students,module}=probs;
    const dispatch=useDispatch();
    const [rows, setRows] = useState([{id:"1",name:"snow",grade:"10"}]);
    const [Students,setStudents]=useState(rows);
    const [rowModesModel, setRowModesModel] = useState({});

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
          event.defaultMuiPrevented = true;
        }
      };
    
      const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
      };
    
      const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
      };
    
      const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
      };
    
      const handleCancelClick = (id) => () => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
          setRows(rows.filter((row) => row.id !== id));
        }
      };
    
      const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      };
    
      const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
      };
      const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        {
          field: 'study',
          headerName: 'Study',
        },
        {
          field: 'division',
          headerName: `Division` ,
          width:"200"
        },
        {
            field: 'grade',
          headerName: `Grade` ,
          width:"200",
          editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 0 || params.props.value > assesment.grades;
        if(hasError){
            dispatch(messageActions.setMessage({messageContent:"Grade value is not valid!",severity:"error"}))
        }
        return { ...params.props, error: hasError };
      },
        },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 130,
          cellClassName: 'actions',
          getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
      
            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  icon={<Save />}
                  label="Save"
                  sx={{
                    color: 'primary.main',
                  }}
                  onClick={handleSaveClick(id)}
                />,
                <GridActionsCellItem
                  icon={<Cancel />}
                  label="Cancel"
                  className="textPrimary"
                  onClick={handleCancelClick(id)}
                  color="inherit"
                />,
              ];
            }
      
            return [
              <GridActionsCellItem
                icon={<Edit />}
                label="Edit"
                disabled={false}
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
            ];
          },
        },
      ];
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid 
      sx={{ height: "400", bgcolor:"#fff",width: '100%',maxWidth:"100vw",overflow:"auto",marginTop:"0.7rem" }}
        rows={Students}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        editMode="row"
        
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        
      />
    </Box>
  );
}