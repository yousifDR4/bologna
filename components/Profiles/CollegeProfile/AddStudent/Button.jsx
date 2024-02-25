import { Field } from "formik";
import classes from "./style.module.css"
const Button=({word="isubmtting"})=>(
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
                {form.isSubmitting?"...uploading":word}
              </button>
            );
          }}
        </Field>

)
export default Button;