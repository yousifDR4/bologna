
import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar.js";
import classes from "./Root.module.css"
import ErrorBox from "./UI/ErrorBox/ErrorBox.js";
import { useDispatch, useSelector } from "react-redux";
import { errorActions } from "../store/error-slice.js";
const Root=()=>{
    const dispatch=useDispatch();
    const showError=useSelector(state=>state.error.showError);
    const divClickHandler=()=>{
        dispatch(errorActions.hideError());
    }
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
    </div>
    </>
)
}
export default Root;