import { Field, Form, Formik } from "formik";
import React from "react";
import Smallinput from "./Smallinput"
import Button from "../../CollegeProfile/AddStudent/Button";
import Select from "react-select";
import classes from "./Schedule.module.css";
import ReactSelect from "../../../UI/Form/ReactSelect";
import { useDispatch, useSelector } from "react-redux";
import Scheduleslice from "../../../../store/Schedule-slice";
import * as Yup from"yup"
const professors = [
  { value: "ali", label: "ali" },
  { value: "ahmed", label: "ahmed" },
];
const initialValues = {
  selectedprofessor: "",
  selectedclassroom:"",
  endtime:"",
  starttime:"",

};
const AddDayForm = ({ name,show,setshow }) => {
  const validationSchema= Yup.object({
    selectedprofessor: Yup.string().required("required"),
    selectedclassroom: Yup.string().required("required"),
    endtime:Yup.string().required("required") .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    starttime:Yup.string().required("required") .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  })
 
  const clickhandle = () => {
    console.log(show);
   setshow(false);
  };
  if (show === true)
    return (
      <div className={classes.form}>
        <button onClick={clickhandle}>X</button>
        <h3 className={classes.h3}>Add a new module to {name}</h3>
        <Formik initialValues={initialValues} enableReinitialize={true} validationSchema={validationSchema}>
          <Form>
            <div className={classes.flex}>
                  <Smallinput
                name="assiset"
                word="chose end time"
                required={false}
              />
              <Smallinput
                name="endtime"
                word="chose end time"
                required={true}
              />
          
              <div className={classes.ReactSelect}>
                <div>
                <ReactSelect
                  options={professors}
                  name={"selectedprofessor"}
                  word={"select professor"}
                />
                </div>
                </div>
                <div className={classes.ReactSelect}>
                  <div>
                  <ReactSelect
                    options={professors}
                    name={"selectedclassroom"}
                    word={"select classroom"}
                  />
                  </div>
                </div>
            </div>
            <span className={classes.button}>   <Button/></span>
         
          </Form>
        </Formik>
      </div>
    );
  else return <></>;
};
export default AddDayForm;
