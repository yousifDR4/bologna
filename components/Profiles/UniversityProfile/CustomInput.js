import { useState } from "react";
import addIcon from "../../../Images/add.png";
import classes from "./CustomInput.module.css";
import { useDispatch } from "react-redux";
import {profileActions} from "../../../store/profile-slice";
import { update_user_profile } from "../../../store/fire";
const CustomInput=(probs)=>{
    let {type,value,showFormDefault,defaultSelection,showEdit}=probs;
    const dispatch=useDispatch();
    const [showForm,setShowForm]=useState(showFormDefault? showFormDefault:false);
    const [selection,setSelection]=useState(defaultSelection ? defaultSelection : "facebook");
    const [inputValue,setInputValue]=useState({value:value? value:"",touched:false});
    const inputNotValid=inputValue.value.length <1  && inputValue.touched;
    const inputChangeHandler=(e)=>{
        setInputValue(prev=> {return {...prev,value:e.target.value}});
    }
    const onSelect=(e)=>{
        setSelection(e.target.value);
    }
    const blurHandler=()=>{
        setInputValue((state)=>{return{...state,touched:true}})
    }
    const sumbitHanlder= async (e)=>{
        e.preventDefault();
        if(type === "social"){
            dispatch(profileActions.setProfileValue({type:selection,value:inputValue.value}));
            await update_user_profile({[selection]:inputValue.value});
        }
        else{
            dispatch(profileActions.setProfileValue({type:type,value:inputValue.value}));
            await update_user_profile({[type]:inputValue.value});
        }
        setShowForm(false);
        if(showEdit) { showEdit(false)};
        setInputValue({type:"",value:""});
    }
    return(
        <>
        {!showForm && <div  className={classes.add} onClick={()=>setShowForm(true)}><img src={addIcon} alt=""/><p>Add a {type}</p> </div>}
       { showForm && <form className={classes.form} onSubmit={sumbitHanlder}>
        <div className={classes.input}>
        <div><input type="text" placeholder={type} value={inputValue.value} onChange={inputChangeHandler} onBlur={blurHandler}/>
        { inputNotValid && <p className={classes.errorText}>Field must not be Empty!</p>}</div>
        {type==="social" && 
         <select type="select"  name="profiletype" onChange={onSelect} value={selection} > 
         <option value="facebook">facebook</option>
         <option value="twitter">twitter</option>
         <option value="instagram">instagram</option>
        </select>
        }
        </div>
        <button onClick={showEdit?()=>showEdit(false):()=>setShowForm(false)} type="button">Cancel</button>
        <button disabled={inputNotValid} type="submit">Save</button>
        </form> }
        </>
    )
}
export default CustomInput;