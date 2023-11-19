import classes from "./Error.module.css";
import Navbar from "./navbar/Navbar";

const Error=()=>{
    return (
        <>
        <Navbar/>
        <main className={classes.main}>
            <h1>404.</h1>
            <div className={classes.line}></div>
            <p>Couldn't find this page.</p>
        </main>
        </>
    )
}
export default Error;
