import classes from "./PlaceHolderLoader.module.css"
const PlaceHolderLoader=()=>{
    return(
        <div className={classes.container}>
        <div class={classes.linearbackground}>
<div className={classes.firstdraw}></div>
  <div class={classes.interdraw}></div>
  <div class={classes.intercrop}></div>
  <div class={classes.interrighttop}></div>
  <div class={classes.interrightbottom}></div>
</div>
</div>
    )
};
export default PlaceHolderLoader;