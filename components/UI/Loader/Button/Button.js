import classes from "./Button.module.css";
const Button=(probs)=>{
    console.log("upload",probs.uploading);
return(
    <button className={classes.button} onClick={probs.clickHandler} disabled={probs.disabled}>
        {!probs.uploading ? probs.children:"uploading..."}
    </button>
)
};
export default Button;