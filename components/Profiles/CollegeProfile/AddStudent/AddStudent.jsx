
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Yup from "yup";
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
import Select from "./Select";
import SelectLevel from "./SelectLevel";
let initialValues = {
  department: "",
  firstname: "",
  lastname: "",
  programs: [],
  program: {},
  mothername: "",
  number: "",
  password: "",
  email: "",
  level: 1,
  maxlevel:6,
  birth: "",
  sex: "male",
  location: "",
};
var form1={};
let mount=0;
const AddStudent = () => {
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const [stetp, setStep] = useState(0);
  const programs=useRef([]);
  const myprograms=useRef([]);
  const [departments,setDepartments]=useState([]);
  const [maxlevel,setMaxLevel]=useState(2);
  const initRef = useRef(null);
  const [change, setchange] = useState(false);
  const [boolen,setbolen]=useState(true);
  const validationSchema = Yup.object({
    password: Yup.string().required("required").min(8, "invalid password"),
    email: Yup.string().required("required").email("invalid email"),
  });
  console.log();
  useEffect(() => {
    if (!auth.currentUser) return;
    if (Department_id.length === 0) return;
    //load Program (if exist (Activated))]
    const f = async () => {
      try {
        console.log("works");
        console.log(Department_id);
      
        const q = query(
          collection(db, "users"),
          where("uid", "in", Department_id)
        );
        const p1 = await getDocs(q);
        const names = p1.docs.map((doc) => ({
          name: doc.data().name,
          id: doc.id,
        }));
        console.log(names);
        console.log(names);
        setDepartments(names);
        if (names.length >0){ initialValues.department = names[0].id;
           const p2 = await get_progs(initialValues.department);
           myprograms.current=p2;
               programs.current=p2;
               initRef.current.setFieldValue("department",initialValues.department)
        
      }
        setchange(true);
      
      } catch (e) {
        console.log(e);
      } finally {
      }
    };
    f();
    // ;
  }, [Department_id]);
  const loop=()=>{
    const arr=[];
    for (let index = 0; index < maxlevel; index++) {
     arr.push(<option value={index+1}>{index+1}</option>)
    }
    return arr;
  }
  let m=0;
 const changeprogram=()=>{
 console.log(initRef.current.values);
 }
  if(initRef.current)
  console.log(initRef.current);
  useEffect(() => {
    console.log(initRef.current.values.department);
    const fetchData = async () => {
      if (initRef.current ) {
        try {
          
          const data = await get_progs(initRef.current.values.department);
           initialValues.program=data[0];
           console.log("kkkkkkkkkkk");
          initialValues.programs=data;
          console.log( initRef.current.values.department, "useEffect");
        } catch (error) {
          console.error("Error fetching programs:", error);
        }
      }
    };
    fetchData();
  }, [initRef.current]);
  const Stepone = () => (
    <Form className="parent" autoComplete="on">
      <Smallinput name="firstname" word="first name" type="text" />
      <Smallinput name="lastname" word="last name" type="text" />
      <Smallinput name="birth" word="birth day" type="date" />
      <span className="spanflex">
        <label htmlFor="sex" className="mylabel">
          sex
        </label>
        <Field as="select" name="sex" className="myselect">
          <option value={"male"}>male</option>
          <option value={"female"}>female</option>
        </Field>
      </span>
      <span className="spanflex">
        <label htmlFor="department" name="department"className="mylabel">
          Department
        </label>
        
         
   <Field as ="select"className="myselect" name="department">
  {departments.length > 0 ? (
    departments.map((prog) => (
      <option key={prog.name} value={prog.id}>
        {prog.name}
      </option>
    ))
  ) : (
    <></>
  )}
</Field>

      
      </span>
     
      <span className="spanflex">
        <label htmlFor="program" className="mylabel" name="program">
          Program
        </label>
        <Select/>
     
      </span>
      <span className="spanflex">
        <label htmlFor="level" className="mylabel">
          Level
        </label>
        <SelectLevel/>
      </span>
      <Largeinput word="email" name="email" type="text" />
      <Largeinput word="password" name="password" type="password" />
      <Largeinput word="number" name="number" type="text" />
      <Largeinput word="mother name" name="mothername" type="text" />
      <span className="spanflex buttonflex">
        <label htmlFor="button" className="mylabel"></label>
        <Field>
          {(props) => {
            const { form } = props;
          
            return (
              <button
                type="submit"
                className="button"
                disabled={!form.dirty}
                onSubmit={form.handleSubmit}
              >
                submit
              </button>
            );
          }}
        </Field>
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
    setbolen(false)
    console.log(+e.target.getAttribute("name"));
    setStep(+e.target.getAttribute("name") - 1);
    console.log(initRef.current.values);
    console.log(initRef.current.values);
    console.log(stetp);
  };
  const handelsubmit = (v) => {
    const filteredObject = Object.entries(v).reduce((acc, [key, value]) => {
      if (value !== "" && key !== "departments") {
        acc[key] = value;
      }

      return acc;
    }, {});
    console.log(filteredObject);
  };
  console.log(departments);
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
        <SelectStep
          name="3"
          selectStep={selectStep}
          text="grade info"
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
