import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar.js";
import classes from "./Root.module.css"
import ErrorBox from "./UI/ErrorBox/ErrorBox.js";
import { useDispatch, useSelector } from "react-redux";
import { errorActions } from "../store/error-slice.js";
import { Alert, Slide, Snackbar } from "@mui/material";
import {messageActions} from "../store/message-slice.js"
import { useRef } from "react";
function slide(props){
  return <Slide {...props} direction="up"></Slide>
}
const Root=()=>{

    const dispatch=useDispatch();
    const showError=useSelector(state=>state.error.showError);
    const showMessage=useSelector(state=>state.message.showMessage);
    const messageContent=useSelector(state=>state.message.messageContent);
    const severity=useSelector(state=>state.message.severity);
  console.log(showMessage,messageContent);
    const divClickHandler=()=>{
        dispatch(errorActions.hideError());
    }
    const handleClose = (event, reason) => {
      dispatch(messageActions.hideMessage())

        if (reason === 'clickaway') {
          return;
        }
      };
return(
    <>
    {showError &&<div className={classes.error}> <ErrorBox/>

    </div>
    }

    {showError &&<div className={classes.backDrop} onClick={divClickHandler}></div>
}
    <div className={classes.firstContainer}>
    <Navbar/>
    <main className={classes.main}><Outlet/></main> 
    <Snackbar
  open={showMessage}
  autoHideDuration={2000}
  onClose={handleClose}
  TransitionComponent={slide}
>
<Alert
    severity={severity}
    sx={{ width: '100%',bgcolor:severity === "success" ?"var(--styling1)":"#cc0000" }}
    variant="filled"
    onClose={handleClose}
  >
    {messageContent}
  </Alert>
</Snackbar>
    </div>
    </>
)
}
export default Root;