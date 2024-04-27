import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import BasicSwtich from '../../../../UI/BaiscSwitch';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

export default function AddBook(probs) {
  const [open, setOpen] = React.useState(false);
  const [fileUrl, setFileUrl] = React.useState(null);
  const [checked,setChecked]=React.useState(false);
    let {setForm,setFieldTouched}=probs;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    console.log(file);
    setFileUrl(file);
    // reader.onloadend = () => {
    // };
    // console.log(reader);
    // reader.readAsDataURL(file);
  };
  const onChange=(e)=>{
    setChecked(e.target.checked);
  }
  return (
    <React.Fragment>
      <Button variant="outlined"  sx={{marginTop:"0.5rem"}} title='Add an USSWL' onClick={handleClickOpen}>
        ADD A BOOK
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
            const name = formJson.name;
            // setFieldTouched((prev)=>{
            //   return {...prev,[type.trim()]:{"noWeeks":false,"noHours":false,"totalHours":false}}
            // })
            setForm((prev)=>{
                console.log(prev);
                return {...prev,"books":[...prev["books"],{"name":name,"file":fileUrl,"available":checked}]}
            })
            handleClose();
          },
        }}
      >
        <DialogTitle>Add a Book</DialogTitle>
        <DialogContent >
          <DialogContentText>
            Please enter the type of the unstructured student work load in the field below
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Book Name"
            type="text"
            fullWidth
            variant="standard"
          />
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{margin:"0.8rem 0rem"}}>
              {fileUrl ? fileUrl.name : "Upload File"}
              <VisuallyHiddenInput type="file" onChange={handleFileUpload}/>
            </Button>
        <BasicSwtich checked={checked} onChange={onChange} label="Available in the library"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}