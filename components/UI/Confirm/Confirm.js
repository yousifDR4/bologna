import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
export default function Confirm(probs) {
    let {message,title,open,setOpen,handleResult}=probs;
    const handleCancel=()=>{
        handleResult(false);
        handleClose();
    }
    const handleConfirmation=()=>{
        handleResult(true);
        handleClose();
    }
  
    const handleClose = () => {
      setOpen(false);
    };
    
    return (
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>cancel</Button>
            <Button onClick={handleConfirmation} autoFocus>
              continue
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }