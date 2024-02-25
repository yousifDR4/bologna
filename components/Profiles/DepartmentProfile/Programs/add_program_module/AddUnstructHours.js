import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AddUnstructHours(probs) {
  const [open, setOpen] = React.useState(false);
    let {setForm,setFieldTouched}=probs;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined"  sx={{marginTop:"0.5rem"}} title='Add an USSWL' onClick={handleClickOpen}>
        Add an USSWL
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const type = formJson.type;
            setFieldTouched((prev)=>{
              return {...prev,[type.trim()]:{"noWeeks":false,"noHours":false,"totalHours":false}}
            })
            setForm((prev)=>{
                return {...prev,"unStructHours":{...prev["unStructHours"],[`${type.trim()}`]:{"noWeeks":"","noHours":"","totalHours":""}}}
            })
           
            probs.setTrigger((prev)=>!prev);
            handleClose();
          },
        }}
      >
        <DialogTitle>Add an USSWL</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the type of the unstructured student work load in the field below
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="type"
            label="Type"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}