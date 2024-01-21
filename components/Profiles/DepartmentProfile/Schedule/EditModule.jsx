import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import classes from "./Schedule.module.css";

const EditModule = ({ moduleData, onSubmit, onCancel, validationSchema }) => {
  console.log(moduleData);
  return (
    <div className={classes.ModalBackdrop}>
      <div className={classes.Modal}>
        <Formik
          onSubmit={onSubmit}
          initialValues={moduleData}
          validationSchema={validationSchema}
        >
          <Form className={classes.ModuleForm}>
            <h2>Add Module for {moduleData.moduleName}</h2>
            <div className={classes.errorcont}>
              <Field type="text" placeholder="Module Name" name="moduleName" />
              <ErrorMessage
                name="moduleName"
                component="div"
                className={classes.error}
              />
            </div>
            <Field type="text" placeholder="Professor Name" name="professor" />
            <ErrorMessage
              name="professor"
              component="div"
              className={classes.error}
            />
            <Field type="time" placeholder="Start Time" name="startTime" />
            <ErrorMessage
              name="startTime"
              component="div"
              className={classes.error}
            />
            <Field type="time" placeholder="End Time" name="endTime" />
            <ErrorMessage name="End Time" component="div" />
            <Field type="text" placeholder="Room" name="room" />
            <ErrorMessage name="room" component="div" />

            <div className={classes.FormActions}>
              <button type="button" onClick={onCancel}>
                Cancel
              </button>
              <Field>
                {(props) => {
                  const { form } = props;
                  return (
                    <button
                      type="submit"
                      className={classes.button}
                      onSubmit={form.handleSubmit}
                      disabled={!form.isValid || form.isSubmitting}
                    >
                      {form.isSubmitting ? "...uploading" : "Edit Module"}
                    </button>
                  );
                }}
              </Field>
            </div>
          </Form>
        </Formik>
        <button onClick={onCancel} className={classes.ModalCloseButton}>
          ×
        </button>
      </div>
    </div>
  );
};
export default EditModule;
