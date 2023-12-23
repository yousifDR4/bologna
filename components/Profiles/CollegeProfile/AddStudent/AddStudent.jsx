// AddStudent.js
import React, { useEffect, useRef, useState } from "react";
import  * as Yup from"yup"
import "./AddStudent.css";
import {
  Formik,
  useFormik,
  FormikConfig,
  Form,
  Field,
  useFormikContext,
  ErrorMessage,
} from "formik";
import Smallinput from "./Smallinput";
import Largeinput from "./Largeinput";
import SelectStep from "./SelectStep";
import { get_progs, get_progs_as_college } from "../../../../store/getandset";
import { useSelector } from "react-redux";
import { auth, db } from "../../../../store/fire";
import { collection, getDocs, query, where } from "firebase/firestore";
let initialValues = {
  department: "",
  departments: [],
  firstname: "",
  lastname: "",
  programs: [],
  program:"",
  mothername: "",
  number: "",
  password: "",
  email: "",
  level: 1,
  birth: "",
  sex: "male",
  location: "",
};
const valied = (values) => {
  let error = {};
  if (!values.email) error.email = "required";
  else {
    if (!values.email.match(validRegex)) {
      error.email = "invalid email";
    }
    if (!values.password) error.password = "required";
    else if (values.password.length < 8) error.password = " invalid password";
    if (!values.birth) error.birth = "required";
    if (!values.department) error.department = "required";
    if (!values.firstname) error.department = "required";
  }
  return error;
};

let validRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const AddStudent = () => {
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const [stetp, setStep] = useState(0);
  const initRef = useRef(null);
  const [change, setchange] = useState(false);
  const validationSchema=Yup.object({
    password: Yup.string().required("required").min( 8,"invalid password"),
    email: Yup.string().email("invalid email"),

  })
  useEffect(() => {
    if (!auth.currentUser) return;
    if (Department_id.length === 0) return;
    //load Program (if exist (Activated))]
    const f = async () => {
      try {
        console.log(Department_id);
        const p1 = get_progs_as_college(Department_id);
        const q = query(
          collection(db, "users"),
          where("uid", "in", Department_id)
        );
        const p2 = getDocs(q);
        const [d, colleges] = await Promise.all([p1, p2]);
       
        const names = colleges.docs.map((doc) => ({
          name: doc.data().name,
          id: doc.id,
        }));
        console.log(names);
        initialValues.programs = d;
        initialValues.departments=names
        if(d.length===1)
        initialValues.program=d[0];
        if(names.length===1)
        initialValues.department=d[0];
        setchange(true);
        console.log(d, "ppppppppppro0edp");
      } catch (e) {
        console.log(e);
      } finally {
      }
    };
    f();
    // ;
  }, [Department_id]);
  console.log(initRef.current);

  const Stepone = () => (
    <Form className="parent" autoComplete="on">
      <Smallinput name="firstname" word="first name" type="text" />
      <Smallinput name="lastname" word="last name" type="text" />
      <Smallinput name="birth" word="birth day" type="date" />
      <span className="spanflex">
        <label htmlFor="sex" className="mylabel">
          sex
        </label>
        <select name="sex" className="myselect">
          <option value={"male"}>male</option>
          <option value={"female"}>female</option>
        </select>
      </span>
      <span className="spanflex">
        <label htmlFor="department" className="mylabel">
          Department
        </label>
        <Field  as="select" className="myselect"  name="department">
     {initialValues.departments.length > 0 ? (
    initialValues.departments.map((prog) => (
      <option key={prog.id} value={prog.name}>
        {prog.name}
      </option>
    ))
  ) : (
    <option value=""  key="null">No programs available</option>
  )}
 
</Field>
      </span>

      <span className="spanflex">
        <label htmlFor="program" className="mylabel">
          Program
        </label>
        <Field as="select" name="program"   className="myselect" >
          {initialValues.programs.length > 0 ? (
            initialValues.programs.map((prog) => (
              <option key={prog.name} value={prog.name}>
                {prog.name}
              </option>
            ))
          ) : (
            <option value="" key="null">No programs available</option>
          )}
        </Field>
      </span>
      <span className="spanflex">
        <label htmlFor="level" className="mylabel">
          Level
        </label>
        <select name="level" className="myselect">
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </span>
      <Largeinput word="email" name="email" type="text" />
      <Largeinput word="password" name="password" type="password" />
      <Largeinput word="number" name="number" type="text" />
      <Largeinput word="mother name" name="mothername" type="text" />
      <span className="spanflex buttonflex">
        <label htmlFor="button" className="mylabel"></label>
        <button type="submit" className="button">
          submit
        </button>
      </span>
    </Form>
  );
  const Steptwo = () => (
    <Form className="parent">
      <Smallinput name="location" word="location" type="text" />
      <span className="spanflex buttonflex">
        <label htmlFor="button" className="mylabel"></label>
        <button type="" className="button">
          submit
        </button>
      </span>
    </Form>
  );
  const currentstep = [<Stepone />, <Steptwo />];
  const check = true;
  const selectStep = (e) => {
    console.log(+e.target.getAttribute("name"));
    setStep(+e.target.getAttribute("name") - 1);
    console.log(initRef.current.values);
    initialValues = initRef.current.values;

    console.log(stetp);
  };
  const handelsubmit=(v)=>{
    const filteredObject = Object.entries(v).reduce((acc, [key, value]) => {
      if (value !== ""&&key!=="departments") {
        acc[key] = value;
      }
    
      return acc;
    }, {});
    console.log(filteredObject);;
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
            <SelectStep
              name="1"
              selectStep={selectStep}
              text="genral info"
              check={stetp}
            />
            <SelectStep
              name="2"
              selectStep={selectStep}
              text="location info"
              check={stetp}
            />
          </ul>
      <Formik
        initialValues={initialValues}
        innerRef={initRef}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handelsubmit}
      >
          {currentstep[stetp]}
      </Formik>
    </div>
  );
};
export default AddStudent;
