import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Yup from "yup";
import "./EditStudent.css";
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
import { useSelector } from "react-redux";
import { auth, creatuser, db } from "../../../../store/fire";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import SelectProgram from "./SelectProgram.jsx";
import SelectLevel from "./SelectLevel";
import { current } from "@reduxjs/toolkit";
import select from "select";
import Steptwo from "./Steptwo.jsx";
import { get_progs } from "../../../../store/getandset.js";
import { getIdToken } from "firebase/auth";
import { Await, useLocation } from "react-router-dom";
import Button from "../AddStudent/Button.jsx";
let initialValues = {
  department: "",
  firstname: "",
  lastname: "",
  programs: [],
  program: "",
  mothername: "",
  number: "",
  level: "",
  maxlevel: 6,
  birth: "",
  sex: "male",
  location: "",
  birthcountry: "",
  city: "",
  country: "",
  city: "",
  selectedCountry: "",
  countries: [],
};
const EditStudent = (props) => {
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const [stetp, setStep] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || ""; //getting module id from url
  const [departments, setDepartments] = useState([]);
  const initRef = useRef(null);
  const [change, setchange] = useState(false);
  const [error, setError] = useState(false);
  const [maxlevel, setmaxlevel] = useState(false);
  const studentdepartment=useRef({});
  const validationSchema = Yup.object({
    program: Yup.string().required("required"),
    department: Yup.string().required("required"),
    level: Yup.string().required("required"),
    firstname:Yup.string().required("first name is required"),
    lastname:Yup.string().required("last name is required")
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
      
        const p1 = async()=>{
          const q = query(
            collection(db, "users"),
            where("uid", "in", Department_id)
          );
          const b=await getDocs(q);
        const names = b.docs.map((doc) => ({
          name: doc.data().name,
          id: doc.id,
        }));
        console.log(Department_id);
        setDepartments(names)
      }
        const p2 = async() => {
        
          const a=await getDoc(doc(db, "users", id));
          const student = a.data();
          studentdepartment.current={name:student.departmentName,Department_id:student.id};
          console.log(student,"ssssssssssssssssssssssss");
          const filteredObject = Object.entries(student).reduce(
            (acc, [key, value]) => {
              if (
                value !== "" &&
                key !== "Department_id" &&
                key !== "University_id" &&
                key !== "College_id" &&
                key !== "password" &&
                key !== "email" &&
                key !== "uid" &&
                key !== "lowerdepartmentName" &&
                key !== "departmentName" &&
                key !== "accountType" &&
                key !== "username"
              ) {
                acc[key] = value;
              }
              return acc;
            },
            {}
          );
          console.log(filteredObject);
          const d = await get_progs(filteredObject.department);
     
          initRef.current.setValues((state) => ({
            ...state,
            ...filteredObject,
            programs: d,
          }));
        };

        await Promise.all([p1(),p2()])
        setchange(true);
      } catch (e) {
        console.log(e);
      } finally {
      }
    };
    f();
    // ;
  }, [Department_id]);
  if (initRef.current) console.log(initRef.current);
  const Stepone = () => (
    <Form className="parent" autoComplete="on">
      <Smallinput name="firstname" word="first name" type="text" required="*"/>
      <Smallinput name="lastname" word="last name" type="text"  required="*" />
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
        <label htmlFor="department" name="department" className="mylabel">
        {true&& (<span className="spancolor">*</span>)}
          Department
        </label>
        <Field as="select" className="myselect" name="department">
          {departments.length > 0 ? (
            departments.map((prog) => (
              <option key={prog.name} value={prog.id}>
                {prog.name}
              </option>
            ))
          ) : (
            <></>
          )}
          <option key={"null"} value={""}>
            no department!
          </option>
        </Field>
      </span>
      <SelectProgram />
      <SelectLevel />
      <Largeinput word="number" name="number" type="text" />
      <Largeinput word="mother name" name="mothername" type="text" />
      <span className="buttonflex">
        <label htmlFor="button" className="mylabel"></label>
        <Button/>

      </span>
    </Form>
  );
  const Stepthere = () => <></>;
  const currentstep = [<Stepone />, <Steptwo />, <Stepthere />];
  const selectStep = (e) => {
    console.log(+e.target.getAttribute("name"));
    setStep(+e.target.getAttribute("name") - 1);
  };
  const handelsubmit = async (v) => {
    const filteredObject = Object.entries(v).reduce((acc, [key, value]) => {
      if (
        value !== "" &&
        key !== "departments" &&
        key !== "maxlevel" &&
        key !== "countries" &&
        key !== "countries" &&
        key !== "programs" &&
        key !== "password" &&
        key !== "email"
      ) {
        acc[key] = value;
      }
      return acc;
    }, {});
    console.log(departments);
    const departmentName = departments.filter(
      (depart) => depart.id === v.department
    )[0].name;
    const lowerdepartmentName = departmentName.toLocaleLowerCase();
    console.log(initRef.current.isSubmitting);
    const info = {
      path: {
        Department_id: v.department,
      },
      pinfo: {
        ...filteredObject,
        departmentName: departmentName,
        lowerdepartmentName: lowerdepartmentName,
      },
    };
    await setDoc(doc(db,"users",id),{...info.path,...info.pinfo},{merge:true});
    if(studentdepartment.Department_id!==v.department){
      await setDoc(doc(db,"password",id),{Department_id:v.department},{merge:true});
    }
  };
  console.log(initRef.current);
  return (
    <div className="mydiv">
      <span>
        {" "}
        <h3 className="title">
          {" "}
          <img alt="" /> Edit student
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
export default EditStudent;
