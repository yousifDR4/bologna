import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Largeinput from "./Largeinput";
import classes from "./ChangeUsername.module.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, changeusername, db } from "../../../../store/fire";
import { usernameprofile } from "../../../../store/getandset";
import { useSelector } from "react-redux";
import { getIdToken } from "firebase/auth";
import Button from "../AddStudent/Button";
let initialValues = {
  username: "",
  password: "",
  department:"",
};
const Changeusername = () => {
  const profile = useSelector((state) => state.profile.profile);
  const validatitionSchema = Yup.object({
    username: Yup.string().required("required username").matches(/^[a-zA-Z0-9]+$/, "Invalid username format"),
    password: Yup.string()
      .required("required password")
      .min(8, "password should be longer then 8 letters"),
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || ""; //getting module id from url
  useEffect(()=>{
    if(id==="")return;
   const f=async()=>{
     const a =await getDoc(doc(db,"users",id))
     initialValues.department=a.data().Department_id;
     initialValues.username=a.data().username;
     console.log(a.data());

   }
   f();
  },[id])
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
        onSubmit={async(values)=>{
          const IdToken=await getIdToken(auth.currentUser);
          const info={
            id:id,
            password:values.password,
            username:values.username,
            College_id:profile.College_id,
            University_id:profile.University_id,
            Department_id:values.department,
            IdToken:IdToken,
          } ;
          console.log(info);
         await changeusername(info);
          
        }}
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
            console.log(form.isSubmitting );
            return (
              <button
                type="submit"
                className={classes.button}
                onSubmit={form.handleSubmit}
                disabled={!form.isValid || form.isSubmitting}
              >
                {form.isSubmitting?"...uploading":"submit"}
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
