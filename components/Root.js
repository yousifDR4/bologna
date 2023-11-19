
import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar.js";
import classes from "./Root.module.css"
const Root=()=>{
return(
    <div className={classes.firstContainer}>
    <Navbar/>
    <main className={classes.main}><Outlet/></main> 
    </div>
)
}
export default Root;