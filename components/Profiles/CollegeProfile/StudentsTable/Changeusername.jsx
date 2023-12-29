import { Field, Form, Formik } from "formik"
import *as Yup from"yup";
import Largeinput from "./Largeinput"
import classes from"./ChangeUsername.module.css"
const initialValues={
    username:"",password:"",
}

const Changeusername=()=>{
  const  validatitionSchema=Yup.object({
        username:Yup.string().required("required username"),
        password:Yup.string().required("required password").min(8,"password should be longer then 8 letters")
    })
    return(
        <div className={classes.mydiv}>
      <span>
        {" "}
        <h3 className={classes.title}>
          {" "}
          <img alt="" /> change username and password
        </h3>
      </span>
        <Formik initialValues={initialValues}
        validationSchema={validatitionSchema}
        >
        <Form className={`${classes.parent}`}>
            <span className={classes.coonst} >
        <Largeinput name={"username"} word={"username"} type="text"/>
        <Largeinput name={"password"} word="password" type="password"/>
        </span>
        <span className={classes.buttonconst}>
        <Field>
          {(props) => {
            const { form } = props;
            console.log(form.isValid);
            return (
              <button
                type="submit"
                className={"mybutton"}
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
    )


}
export default Changeusername;