// AddStudent.js

import React, { useState } from "react";
import "./AddStudent.css";
import { Formik, useFormik ,FormikConfig, Form,Field} from "formik";
import Smallinput from "./Smallinput";
import Largeinput from "./Largeinput";
import SelectStep from "./SelectStep";
const initialValues = {
  department: "",
  firstname: "",
  lastname: "",
  program: "",
  mothername: "",
  number: "",
  password: "",
  email: "",
  level: 1,
  birth: null,
  sex: "male",
  location:"",
};
let validRegex =
/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const AddStudent = () => {
 const [stetp,setStep]=useState(0);
  const formik = useFormik({
    initialValues,
    validate: (values) => {
      let error = {};
      if (!values.email) error.email = "required";
      else {
        if (!values.email.match(validRegex)) {
          error.email = "no valied email";
        }
        if (!values.password) error.password = "required";
        else if (values.password.length < 8)
          error.password = "no valied password";
        if (!values.birth) error.birth = "required";
        if (!values.department) error.department = "required";
        if (!values.firstname) error.department = "required";
      }
      return error;
    },
    onSubmit: () => {
      console.log(formik.errors);
    },
  });
  console.log(formik.values);
  const Stepone=()=>(
    <Formik initialValues={initialValues} onSubmit={(val)=>{
      console.log(val);

    }} >
      <Form className="parent" >
        <Smallinput
          name="firstname"
          handleChange={formik.handleChange}
          word="first name"
          type="text"
          />
        <Smallinput
          name="lastname"
          word="last name"
          type="text"
        />
        <Smallinput
          name="birth"
          word="birth day"
          type="date"
        />
        <span className="spanflex">
          <label htmlFor="sex" className="mylabel">
            sex
          </label>
          <select
            name="sex"
            className="myselect"
           >
            <option value={"male"} >
              male
            </option>
            <option value={"female"} >
              female
            </option>
          </select>
        </span>
        <span className="spanflex">
          <label htmlFor="department" className="mylabel">
            Department
          </label>
          <select
            name="department"
            className="myselect"
           
            
          >
            <option value="computerScience">
              Computer Science
            </option>
          </select>
        </span>
        <span className="spanflex">
          <label htmlFor="program" className="mylabel">
            Program
          </label>
          <select name="program" className="myselect">
            <option value="bachelor">Bachelor</option>
          </select>
        </span>
        <span className="spanflex">
          <label htmlFor="level" className="mylabel">
            Level
          </label>
          <select
            name="level"
            className="myselect"
          >
            <option value={1}>
              1
            </option>
            <option value={2} >
              2
            </option>
            <option value={3}>
              3
            </option>
            <option value={4} >
              4
            </option>
            <option value={5} >
              5
            </option>
            <option value={6} >
              6
            </option>
          </select>
        </span>
        <Largeinput
            word="email"
            name="email"
            type="text"
           
          />
        <Largeinput
            word="password"
            name="password"
            type="password"
           
          />
        <Largeinput
            word="number"
            name="number"
            type="text"
          />
          <Largeinput
            word="mother name"
            name="mothername"
            type="text"
          />
        <span className="spanflex buttonflex">
          <label htmlFor="button" className="mylabel"></label>
          <button type="" className="button">
            submit
          </button>
        </span>
      </Form>
      </Formik>
  )
  const Steptwo=()=>(
    <Formik initialValues={initialValues} >
      <form action="" className="parent" onSubmit={formik.handleSubmit}>
      
      <Smallinput
        name="location"
        handleChange={formik.handleChange}
        word="location"
        type="text"
        value={formik.values.location}
        />
        </form>
      </Formik>

  )
  const currentstep=[<Stepone/>,<Steptwo/>];
  console.log(formik.values);
  console.log(formik.errors);
  const check=true;
  const selectStep=(e)=>{
    console.log(+e.target.getAttribute("name"));
    setStep(+e.target.getAttribute("name")-1)
  
    console.log(stetp);
  }
  return (
    <div className="mydiv">
      <span>
        {" "}
        <h3 className="title">
          {" "}
          <img alt="" /> Add a new student
        </h3>
      </span>
      <ul className="mylist"> 
      <SelectStep name="1" selectStep={selectStep} text="genral info" check={stetp} />
      <SelectStep name="2" selectStep={selectStep} text="location info" check={stetp} />
      </ul>
      {currentstep[stetp]}
    </div>
  );
};
export default AddStudent;
