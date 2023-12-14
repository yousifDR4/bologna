import React, { useState, useEffect, useReducer } from "react";
import { auth, creatuser } from "../../store/fire";
import classes from "./AddUniversity.module.css";
import { getIdToken } from "firebase/auth";

const intilistate = {
  email: "",
  emailtouched: false,
  password: "",
  passwordtouched: false,
  name: "",
  nametouched: false,
};
function reducer(state, action) {
  let newstate = {};
  switch (action.type) {
    case "touch":
      newstate = { ...state, [action.value]: true };
      break;
    case "input":
      newstate = { ...state, [action.input]: action.value };
      break;
    case "reset":
      newstate = {
        name: "",
        nametouched: false,
        email: "",
        emailtouched: false,
        password: "",
        passwordtouched: false,
      };
    default:
  }
  return newstate;
}

const AddUniversity = (probs) => {
  const [state, dispatch] = useReducer(reducer, intilistate);
  const inputsValid = {
    email: state.email.trim() !== "",
    password: state.password.length > 7,
    name: state.name.trim() !== "",
  };
  const [formIsValid, setFormIsValid] = useState(false);
  const [error ,seterror]=useState(false);
  const [loading,setLoading]=useState(true);
  useEffect(() => {
    if (inputsValid.email && inputsValid.password && inputsValid.name) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [inputsValid]);

  const blurHandler = (e) => {
    const action = {
      type: "touch",
      value: e.target.name + "touched",
    };
    dispatch(action);
  };

  function onchange(e) {
    let creationType="";
    if(state.email.includes("@") && state.email.includes(".com")){
      creationType="email";
    }
    else{
      creationType="username";
    }
    console.log(creationType);
    const action = {
      type: "input",
      input: e.target.name,
      value: e.target.value,
    };
    dispatch(action);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    let creationType="";
    if(state.email.includes("@") && state.email.includes(".com")){
      creationType="emailandpassword";
    }
    else{
      creationType="username";
    }
    try {
      setLoading(true);
      const IdToken = await getIdToken(auth.currentUser);
      
      const info = {
        email: state.email,
        password: state.password,
        createType: creationType,
        name: state.name,
        accountType: "University",
        IdToken: IdToken,
      };
      console.log(info);
      const k = await creatuser(info);
      if(k.uid)
      probs.updateUniversity();
      // console.log(k);
    } catch (e) {
      console.log(e);
      seterror(false);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className={`${classes.container} ${probs.className}`}>
      <form action="" className=" form">
        <h3>Add University</h3>
        <label htmlFor="email">
          Email or Username<span className={classes.star}>*</span>
        </label>
        <input
          type="email"
          placeholder=""
          name="email"
          id="email"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.email}
        />
        {!inputsValid.email && state.emailtouched && (
          <p className={classes.errorText}>Email or username must be valid!</p>
        )}
        <label className="text">
          Password<span className={classes.star}>*</span>
        </label>
        <input
          name="password"
          type="password"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.password}
          placeholder="more than 7 characters.."
        />
        {!inputsValid.password && state.passwordtouched && (
          <p className={classes.errorText}>password must not be empty!</p>
        )}
        <label className="text">
          Name<span className={classes.star}>*</span>
        </label>
        <input
          name="name"
          type="text"
          onChange={onchange}
          onBlur={blurHandler}
          value={state.name}
        />
        {!inputsValid.name && state.nametouched && (
          <p className={classes.errorText}>name must not be empty!</p>
        )}
        <div className={classes.button}>
          {" "}
          <button onClick={submitHandler} disabled={!formIsValid}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddUniversity;
