import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AddOutlined, Edit } from '@mui/icons-material';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../store/fire';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../../store/fire';
import {messageActions} from "../../../store/message-slice"
const fields=[   
    "title",
    "description",]
export default function AddPost(probs) {
  const profile = useSelector((state) => state.profile.profile);
  const [Uploading, setUploading] = React.useState(false);
  let {initialValues,edit=false,open,setOpen,refetch=()=>{}}=probs;
  const dispatch=useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
console.log(probs);

  return (
    <React.Fragment>
       {edit && <Button startIcon={edit? <Edit/>:<AddOutlined/>} variant={edit ? "contained" : "outlined"}  sx={edit ?{'&:hover':{bgcolor:"#a2d0fb !important",border:"none"},bgcolor:"#add5fb !important",width:"50%",boxShadow:"none",color:"#fff",border:"none"}:{}} title='Add an Exam' onClick={handleClickOpen}>
      </Button>}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async(event) => {
            event.preventDefault();
            setUploading(true);
            try{
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            let p={title:formJson.title,description:formJson.description,user:auth.currentUser.uid};
            const ref=await addDoc(collection(db,"Posts"),p);
            dispatch(messageActions.setMessage({messageContent:"The Post was added succesfully!",severity:"success"}));
            refetch();
            }
            catch(e){
                console.log(e);
                dispatch(messageActions.setMessage({messageContent:"An error has occurred!",severity:"error"}))
            }
            finally{
                setUploading(false);
            }
            handleClose();
          },
        }}
      >
        <DialogTitle>Add a Post</DialogTitle>
        <DialogContent>
          {fields.map((field)=>
           <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name={field}
            label={field.toLocaleUpperCase()}
            type="text"
            fullWidth
            variant="standard"
            multiline={field == "description"}
            rows={4}
            defaultValue={edit ? initialValues[field] || '':""} 
          />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={Uploading} type="submit">{Uploading ? "Uploading..." :edit? "Save":"Add"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}