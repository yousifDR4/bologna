import { useDispatch, useSelector } from "react-redux";
import classes from "./ErrorBox.module.css";
import { errorActions } from "../../../store/error-slice";
const ErrorBox=()=>{
    const dispatch=useDispatch();
    const title=useSelector(state=>state.error.title);
    const message=useSelector(state=> state.error.message);
    const clickHanlder=()=>{
        dispatch(errorActions.hideError());
    }
    return(
        <div>
        <div className={classes.modal}>
        <header className={classes.header}>
            <h2>{title}</h2>
        </header>
        <div className={classes.content}>
            <p>{message}</p>
        </div>
        <footer className={classes.actions}>
<button onClick={clickHanlder} className={classes.button}>Ok</button>
        </footer>
</div>
</div>
    )
};
export default ErrorBox;