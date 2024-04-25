import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AddOutlined, Edit, Info } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { addDoc, collection, setDoc } from "firebase/firestore";
import { auth, db } from "../../../store/fire";
import { useDispatch, useSelector } from "react-redux";
import { messageActions } from "../../../store/message-slice";

export default function AddAssesment(probs) {
  const [open, setOpen] = React.useState(false);
  let { modules, edit = false, selectedModule, initialValues } = probs;
  const [selectedType, setSelectedType] = React.useState(
    edit ? initialValues["type"] || "" : ""
  );
  const dispatch=useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  
  const [selectedDate, setSelectedDate] = React.useState(
    edit ? initialValues["date"] || "" : ""
  );
  let assesmentGrade = edit ? initialValues["Grade"] || "" : "";
  let assesmentTitle = edit ? initialValues["title"] || "" : "";
  let assesmentNotes = edit ? initialValues["notes"] || "" : "";
  const fields = [
    { name: "Assesment Title", value: assesmentTitle },
    { name: "Assesment Grade", value: assesmentGrade },
    { name: "Assesment Notes", value: assesmentNotes },
  ];
  let selectedModuleObj = modules.filter((mod) => mod.id === selectedModule)[0];
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleChange = (event) => {
    setSelectedType(event.target.value);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        disabled={selectedModule === ""}
        startIcon={edit ? <Edit /> : <AddOutlined />}
        variant={edit ? "contained" : "outlined"}
        sx={
          edit
            ? {
                "&:hover": { bgcolor: "#a2d0fb !important", border: "none" },
                bgcolor: "#add5fb !important",
                width: "50%",
                boxShadow: "none",
                color: "#fff",
                border: "none",
                padding:"0.1rem 0.2rem"
              }
            : {
              padding:"0.3rem 0.4rem"
            }
        }
        onClick={handleClickOpen}
      >
        {edit ? "Edit" : "Add an assesment"}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{

          component: "form",
          onSubmit: async (event) => {

            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            console.log(selectedDate);
            try{
            const info = {
              M: selectedDate.$M,
              D: selectedDate.$D,
              y: selectedDate.$y,
              title: formJson["Assesment Title"],
              grades: +formJson["Assesment Grade"],
              notes: formJson["Assesment Notes"],
              module:selectedModule,
              Department_id:Department_id,
              uid:auth.currentUser.uid
            };
            console.log(info);
            await addDoc(collection(db,"Assesment"), info);
            dispatch(messageActions.setMessage({messageContent:"The Assesment was added succesfully!",severity:"success"}))
            probs.refetch();
          }
          catch(e){
            dispatch(messageActions.setMessage({messageContent:"The Assesment creation process failed!",severity:"error"}))
          }
            handleClose();
          },
        }}
      >
        <DialogTitle>Add an Assesment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the exam information below(note that the grade will be
            rounded according to value specified in module information)
          </DialogContentText>
          <FormControl
            sx={{ minWidth: "100%", paddingLeft: "0", margin: "8px 0 4px " }}
            size="small"
          >
            <InputLabel id="type" sx={{ color: "var(--styling1) !important" }}>
              Type
            </InputLabel>
            <Select
              id="type"
              label="Type"
              labelId="type"
              onChange={handleChange}
              fullWidth
              disabled={selectedModule === ""}
              value={selectedType}
              sx={{
                height: "2.5rem",
                color: "var(--styling1)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--styling1) !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "var(--styling1)",
                },
              }}
            >
               <MenuItem key="asmd" value="AssesmentMidTerm">
                      {" "}
                      Midterm Assesment
                    </MenuItem>
              {selectedModuleObj?.AssesmentLab
                ? selectedModuleObj.AssesmentLab.activated && (
                    <MenuItem key="asl" value="AssesmentLab">
                      {" "}
                      Lab Assesment
                    </MenuItem>
                  )
                : ""}
              {selectedModuleObj?.AssesmentOnline
                ? selectedModuleObj.AssesmentOnline.activated && (
                    <MenuItem key="aso" value="AssesmentOnline">
                      {" "}
                      Online Assesment
                    </MenuItem>
                  )
                : ""}
              {selectedModuleObj?.AssesmentOnsight
                ? selectedModuleObj.AssesmentOnsight.activated && (
                    <MenuItem key="asos" value="AssesmentOnsight">
                      {" "}
                      Onsight Assesment
                    </MenuItem>
                  )
                : ""}
              {selectedModuleObj?.AssesmentProject
                ? selectedModuleObj.AssesmentProject.activated && (
                    <MenuItem key="asp" value="AssesmentProject">
                      {" "}
                      Project Assesment
                    </MenuItem>
                  )
                : ""}
              {selectedModuleObj?.AssesmentQuizes
                ? selectedModuleObj.AssesmentQuizes.activated && (
                    <MenuItem key="asq" value="AssesmentQuizes">
                      {" "}
                      Quiz Assesment
                    </MenuItem>
                  )
                : ""}
              {selectedModuleObj?.AssesmentReports.activated
                ? selectedModuleObj.AssesmentReports.activated && (
                    <MenuItem key="asq" value="AssesmentReports">
                      {" "}
                      Report Assesment
                    </MenuItem>
                  )
                : ""}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              marginTop: "0.4rem",
              minWidth: "8rem",
              width: "100%",
              paddingLeft: "0",
            }}
            size="small"
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="date"
                name="Date"
                label="Date"
                labelId="date"
                onChange={(e) => setSelectedDate(e)}
                disabled={selectedModule === ""}
                value={selectedDate}
                sx={{
                  bgcolor: "#fff",
                  color: "var(--styling1) !important",
                  borderColor: "var(--styling1)!important",
                  "& .MuiOutlinedInput-notchedOutline": {
                    color: "var(--styling1) !important",
                    borderColor: "var(--styling1)!important",
                  },
                  "& .Mui-error": {
                    color: "var(--styling1) !important",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "var(--styling1) !important",
                  },
                  "& .MuiInputLabel-root": {
                    color: "var(--styling1) !important",
                  },
                }}
              />
            </LocalizationProvider>
          </FormControl>
          {fields.map((field) => (
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name={field.name}
              label={field.name.toLocaleUpperCase()}
              type="text"
              fullWidth
              variant="standard"
              defaultValue={field.value}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{edit ? "Save" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
