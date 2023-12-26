import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { useSelector } from "react-redux";
import { auth, db } from "../../../../store/fire";
import { collection, getDocs, query, where } from "firebase/firestore";
import SelectProgram from "./SelectProgram.jsx";
import SelectLevel from "./SelectLevel";
import { current } from "@reduxjs/toolkit";
import select from "select";
import Steptwo from "./Steptwo.jsx";
import { get_progs } from "../../../../store/getandset.js";
let initialValues = {
  department: "",
  firstname: "",
  lastname: "",
  programs: [],
  program: "",
  mothername: "",
  number: "",
  password: "",
  email: "",
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
const AddStudent = () => {
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const [stetp, setStep] = useState(0);
  const programs = useRef([]);
  const myprograms = useRef([]);
  const [departments, setDepartments] = useState([]);
  const initRef = useRef(null);
  const [change, setchange] = useState(false);
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
        setDepartments(names);
        if (names.length > 0) {
      
          initRef.current.setFieldValue("department", names[0].id);
          
         
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
  if (initRef.current) console.log(initRef.current);
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
        <label htmlFor="department" name="department" className="mylabel">
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
      <Largeinput word="email" name="email" type="text" />
      <Largeinput word="password" name="password" type="password" />
      <Largeinput word="number" name="number" type="text" />
      <Largeinput word="mother name" name="mothername" type="text" />
      <span className="spanflex buttonflex">
        <label htmlFor="button" className="mylabel"></label>
        <Field>
          {(props) => {
            const { form } = props;
            console.log(form.isValid);
            return (
              <button
                type="submit"
                className={"mybutton"}
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
  const Stepthere = () => <></>;
  const currentstep = [<Stepone />, <Steptwo />, <Stepthere />];
  const selectStep = (e) => {
    console.log(+e.target.getAttribute("name"));
    setStep(+e.target.getAttribute("name") - 1);
  };

  const handelsubmit = (v) => {
    const filteredObject = Object.entries(v).reduce((acc, [key, value]) => {
      if (
        value !== "" &&
        key !== "departments" &&
        (key !== "maxlevel") && (key !== "countries")&&key!=="countries"&&key!=="programs"
      ) {
        acc[key] = value;
      }
      return acc;
    }, {});
    console.log(filteredObject);
  };
  console.log(initRef.current);
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
