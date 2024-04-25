import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import "./AddStudent.css";
import { Formik } from "formik";
import SelectStep from "./SelectStep";
import { useDispatch, useSelector } from "react-redux";
import {
  auth,
  createSTEM,
  createSTUS,
  creatuser,
  db,
} from "../../../../store/fire";
import { collection, getDocs, query, where } from "firebase/firestore";
import Steptwo from "./Steptwo.jsx";
import { getIdToken } from "firebase/auth";
import { errorActions } from "../../../../store/error-slice.js";
import Stepone from "./Stepone.jsx";
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
  selectedCountry: "",
  countries: [],
  acceptancetype:"",
  fatherwork:"",
  note:"",
  bloodgroup:"",
};
const AddStudent = () => {
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const [stetp, setStep] = useState(0);
  const [departments, setDepartments] = useState([]);
  const initRef = useRef(null);
  const [change, setchange] = useState(false);
  const dispatchRedux = useDispatch();
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    email: Yup.string().test(
      "is-email-or-username",
      "Invalid email or username",
      function (value) {
        if (!value) {
          return this.createError({
            message: "Email or username is required",
            path: "email",
          });
        }
        const isEmail = Yup.string().email().isValidSync(value);
        const isUsername = Yup.string()
          .matches(/^[a-zA-Z0-9]+$/, "Invalid username format")
          .isValidSync(value);
        if (!(isEmail || isUsername)) {
          return this.createError({
            message: "Invalid email or username",
            path: "email",
          });
        }
        return true;
      }
    ),
    program: Yup.string().required("Program is required"),
    department: Yup.string().required("Department is required"),
    level: Yup.string().required("Level is required"),
    firstname: Yup.string().required("first name is required"),
    lastname: Yup.string().required("last name is required"),
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
  const Stepthere = () => <></>;
  const currentstep = [
    <Stepone departments={departments} />,
    <Steptwo />,
    <Stepthere />,
  ];
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
        console.log(acc[key]);
      }
      return acc;
    }, {});
    console.log(departments);
    const departmentName = departments.filter(
      (depart) => depart.id === v.department
    )[0].name;
    const lowerdepartmentName = departmentName.toLocaleLowerCase();
    console.log(initRef.current.isSubmitting);
    try {
      if (!v.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        console.log("trueee");
        const IdToken = await getIdToken(auth.currentUser);
        const info = {
          IdToken: IdToken,
          createType: "username",
          email: v.email,
          password: v.password,
          accountType: "student",
          random: false,
          path: {
            Department_id: v.department,
            University_id: profile.University_id,
            College_id: profile.College_id,
          },
          pinfo: {
            ...filteredObject,
            departmentName: departmentName,
            lowerdepartmentName: lowerdepartmentName,
          },
        };
        const res = await createSTUS(info);
        console.log(res);
        if (res.code === "auth/uid-already-exists") {
          console.log("username already exist");
          const error = new Error("uername already exist");
          throw error;
        }
      } else {
        const IdToken = await getIdToken(auth.currentUser);
        const info = {
          IdToken: IdToken,
          createType: "email",
          email: v.email,
          password: v.password,
          accountType: "student",
          random: false,
          path: {
            Department_id: v.department,
            University_id: profile.University_id,
            College_id: profile.College_id,
          },
          pinfo: {
            ...filteredObject,
            departmentName: departmentName,
            lowerdepartmentName: lowerdepartmentName,
          },
        };
        const res = await createSTEM(info);
        console.log(res);
        if (res.code === "auth/email-already-exists") {
          console.log("email already exist");
          const error = new Error();
          throw error;
        }
      }
    } catch (e) {
      if (e.message === "username already exist") {
        dispatchRedux(
          errorActions.setError({
            title: "Creating Account Faild",
            message: "Sorry, you unable to create account with this username",
          })
        );
      } else {
        console.log("kkkkk");
        dispatchRedux(
          errorActions.setError({
            title: "Creating Account Faild",
            message: "Sorry, you unable to create account with this email",
          })
        );
      }
      console.log(e);
    }
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
          text="extra information"
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
