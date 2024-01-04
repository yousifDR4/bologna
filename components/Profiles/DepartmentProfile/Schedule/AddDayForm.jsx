import { Field, Form, Formik } from "formik";
import React from "react";
import Smallinput from "../../CollegeProfile/AddStudent/Smallinput";
import Button from "../../CollegeProfile/AddStudent/Button";
import Select from "react-select";
import classes from "./Schedule.module.css";
import ReactSelect from "../../../UI/Form/ReactSelect";
import { useDispatch, useSelector } from "react-redux";
import Scheduleslice from "../../../../store/Schedule-slice";
const professors = [
  { value: "ali", label: "ali" },
  { value: "ahmed", label: "ahmed" },
];
const initialValues = {
  time: "",
  selectedprofessor: "",
};
const AddDayForm = ({ name }) => {
  const show = useSelector((state) => state.days[name].show);
  const dispathchredux = useDispatch();
  const clickhandle = () => {
    console.log(show);
    dispathchredux(Scheduleslice.actions.rest({ name: name }));
  };
  console.log(show);
  console.log(name);
  if (show === true)
    return (
      <div className={classes.form}>
        <button onClick={clickhandle}>X</button>
        <h3 className={classes.h3}>Add a new module to {name}</h3>
        <Formik initialValues={initialValues} enableReinitialize={true}>
          <Form>
            <div className={classes.flex}>
              <Smallinput
                name="starttime"
                word="chose end time"
                required={true}
                className={classes.h3}
              />
              <Smallinput
                name="endtime"
                word="chose end time"
                required={true}
              />
              <div className={classes.ReactSelect}>
                <ReactSelect
                  options={professors}
                  name={"selectedprofessor"}
                  word={"select professor"}
                />
                </div >
                <div className={classes.ReactSelect}>
                  <ReactSelect
                    options={professors}
                    name={"selectedclassroom"}
                    word={"select classroom"}
                  />
                </div>
             
            </div>
            <Button />
          </Form>
        </Formik>
      </div>
    );
  else return <></>;
};
export default AddDayForm;
