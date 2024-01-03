import { Field, Form, Formik } from "formik";
import React from "react";
import Smallinput from "../../CollegeProfile/AddStudent/Smallinput";
import Select from "react-select";
import classes from"./Schedule.module.css"
const professors = [
  { value: "ali", label: "ali" },
  { value: "ahmed", label: "ahmed" },
];
const initialValues = {
  time: "",
  selectedprofessor: "",
};
const AddDayForm = ({ show }) => {
  if (show)
    return (
      <Formik initialValues={initialValues} enableReinitialize={true}>
        <Form className={classes.form}>
          <Smallinput name="time" />
          <label htmlFor={"selectedprofessor"}>select country</label>
          <Field>
            {(probs) => {
              const { form } = probs;
              console.log(form);
              return (
                <Select
                  placeholder={"select professor"}
                  options={professors}
                  name="selectedprofessor"
                  value={{
                    value: form.values.selectedprofessor,
                    label: form.values.selectedprofessor,
                  }}
                  onChange={(selectedOption) => {
                    console.log(selectedOption.value);
                    form.setFieldValue(
                      "selectedprofessor",
                      selectedOption.value
                    );
                  }}
                  onBlur={form.handleBlur}
                />
              );
            }}
          </Field>
        </Form>
      </Formik>
    );
  else return <></>;
};

export default AddDayForm;
