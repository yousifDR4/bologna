import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Largeinput from "./../AddStudent/Largeinput";
import classes from "./ChangeUsername.module.css";
import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, changeusername, db } from "../../../../store/fire";
import { usernameprofile } from "../../../../store/getandset";
import { useDispatch, useSelector } from "react-redux";
import { getIdToken } from "firebase/auth";
import {  useNavigate } from "react-router-dom";
import Button from "../AddStudent/Button";
import { errorActions } from "../../../../store/error-slice";
let initialValues = {
  username: "",
  password: "",
  department: "",
};
const Changeusername = () => {
  const profile = useSelector((state) => state.profile.profile);
  const dispatchRedux = useDispatch();
  const navigate=useNavigate();
  const validatitionSchema = Yup.object({
    username: Yup.string()
      .required("required username")
      .matches(/^[a-zA-Z0-9]+$/, "Invalid username format"),
    password: Yup.string()
      .required("required password")
      .min(8, "password should be longer then 8 letters"),
  });
  const formRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || ""; //getting module id from url
  useEffect(() => {
    if (id === "") return;
    const f = async () => {
      const a = await getDoc(doc(db, "users", id));
      const department = a.data().Department_id;
      const username = a.data().username;
      console.log(id, "iddddddddd");
      formRef.current.setValues((state) => ({
        ...state,
        department: department,
        username: username,
      }));
    };
    f();
  }, [id]);
  const handleSubmit = async (values) => {
    try {
      const IdToken = await getIdToken(auth.currentUser);
      const info = {
        id: id,
        password: values.password,
        username: values.username,
        College_id: profile.College_id,
        University_id: profile.University_id,
        Department_id: values.department,
        IdToken: IdToken,
      };
      console.log(info);
      const res = await changeusername(info);
      if (res.code === "auth/uid-already-exists") {
        console.log("works");
        const error = new Error("auth/uid-already-exists");
        throw error;
      }
     else
     navigate("/StudentsTable")
    } catch (e) {
      console.log(e.message);
      if (e.message === "auth/uid-already-exists") {
        dispatchRedux(
          errorActions.setError({
            title: "Creating Account Faild",
            message: "Sorry, you unable to create account with this username",
          })
        );
      } 
      
    }
  }

  return (
    <div className={classes.mydiv}>
      <span>
        {" "}
        <h3 className={classes.title}>
          {" "}
          <img alt="" /> change username and password
        </h3>
      </span>
      <Formik
        initialValues={initialValues}
        validationSchema={validatitionSchema}
        enableReinitialize={true}
        innerRef={formRef}
        onSubmit={handleSubmit}
      >
        <Form className={`${classes.parent}`}>
          <span className={classes.coonst}>
            <Largeinput name={"username"} word={"username"} type="text" />
            <Largeinput name={"password"} word="password" type="password" />
          </span>
          <span className={classes.buttonconst}>
            <Field>
              {(props) => {
                const { form } = props;
                console.log(form);
                console.log(form.isSubmitting);
                return (
                  <button
                    type="submit"
                    className={classes.button}
                    onSubmit={form.handleSubmit}
                    disabled={!form.isValid || form.isSubmitting}
                  >
                    {form.isSubmitting ? "...uploading" : "submit"}
                  </button>
                );
              }}
            </Field>
          </span>
        </Form>
      </Formik>
    </div>
  );
};
export default Changeusername;
