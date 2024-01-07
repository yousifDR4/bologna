import React, { useEffect, useReducer, useState } from "react";
import classes from "./Schedule.module.css";
import { ReactComponent as PlusIcon } from "./icons8-plus.svg";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../store/fire";
import { useSelector } from "react-redux";
import { getSchedule } from "../../../../store/getandset";
import Loading from "./Loading";
import EditModule from "./EditModule";
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Saturday",
];
const validationSchema = Yup.object({
  moduleName: Yup.string().required("required"),
  professor: Yup.string().required("required"),
  room: Yup.string().required("required"),
  startTime: Yup.string()
    .required("required")
    // Using Yup.ref to reference other values in the schema
    .test("is-greater", "Start time must be before end time", function (value) {
      const { endTime } = this.parent;
      console.log(value, "  ", endTime);
      return value && endTime && value < endTime;
    }),
  endTime: Yup.string().required("required"),
});
const initstate = {
  moduleName: "",
  professor: "",
  startTime: "",
  endTime: "",
  room: "",
};
const initscheduleData = {
  Monday: [],
  Tuesday: [],
  Saturday: [],
  Wednesday: [],
  Thursday: [],
  Saturday: [],
};
const reducer = (state, action) => {
  switch (action.type) {
    case "onchange": {
      let arr = [];
      arr = [...state[action.selectedDay], action.values];
      arr.sort((a, b) => {
        const startTimeA = a.startTime.split(":");
        const startTimeB = b.startTime.split(":");
        const hoursDiff =
          parseInt(startTimeA[0], 10) - parseInt(startTimeB[0], 10);
        if (hoursDiff !== 0) {
          return hoursDiff;
        } else {
          return parseInt(startTimeA[1], 10) - parseInt(startTimeB[1], 10);
        }
      });
      return { ...state, [action.selectedDay]: arr };
    }
    case "onfetch": {
      return { ...state, ...action.values };
    }
    case "Edit": {
      const newDayArray = state[action.selectedDay].map((value, index) => {
        if (value.id === action.values.id) {
          return { ...value, ...action.values };
        }
        return value;
      });
      console.log(newDayArray);
      return { ...state, [action.selectedDay]: newDayArray };
    }
    case "remove": {
      let arr = [];
      arr = state[action.selectedDay].filter(
        (module) => action.values.id !== module.id
      );
      return { ...state, [action.selectedDay]: arr };
    }
    default:
      return state;
  }
};
const Schedule = () => {
  const Department_id = useSelector(
    (state) => state.profile.profile.Department_id
  );
  const [addingForDay, setAddingForDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setEditShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleData, dispatch] = useReducer(reducer, initscheduleData);
  const [editModule, setEditModule] = useState(null);
  const openModal = (day) => {
    setShowModal(true);
    setSelectedDay(day);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedDay(null);
  };
  const closeEditModal = () => {
    setEditShowModal(false);
    setEditModule(null);
  };
  const handleAddModuleClick = (day) => {
    console.log(day);
    setAddingForDay(day);
    openModal(day);
  };
  useEffect(() => {
    setLoading(true);
    if (!Department_id) return;
    getSchedule(Department_id)
      .then((res) => {
        dispatch({
          values: res,
          type: "onfetch",
        });
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [Department_id]);
  const handleSubmit = async (values) => {
    const ref = await addDoc(collection(db, "Schedule"), {
      selectedDay: selectedDay,
      info: values,
      Department_id: Department_id,
    });
    dispatch({
      values: { ...values, id: ref.id },
      selectedDay: selectedDay,
      type: "onchange",
    });
    closeModal();
    setSelectedDay(null);
  };
  const handleEdit = async (values) => {
    dispatch({ values: values, selectedDay: selectedDay, type: "Edit" });
    console.log(values);
    console.log(selectedDay);
    console.log(editModule.id);
    await setDoc(
      doc(db, "Schedule", editModule.id),
      {
        selectedDay: selectedDay,
        info: values,
        Department_id: Department_id,
      },
      { merge: true }
    );
    closeEditModal();
    setSelectedDay(null);
    setEditModule(null);
    setEditShowModal(false);
  };
  return (
    <div className={classes.ScheduleContainer}>
      <table className={classes.ScheduleTable}>
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {daysOfWeek.map((day) => (
              <td key={day} className={classes.DayColumn}>
                {loading === true ? (
                  <Loading />
                ) : (
                  <div>
                    {scheduleData[day] && scheduleData[day].length > 0 ? (
                      scheduleData[day].map((module, index) => (
                        <div
                          key={index}
                          className={classes.ModuleCard}
                          onClick={() => {
                            setEditModule(module);
                            setEditShowModal(true);
                            setSelectedDay(day);
                          }}
                        >
                          <div className={classes.ModuleName}>
                            {module.moduleName}
                          </div>
                          <div className={classes.ProfessorName}>
                            {module.professor}
                          </div>
                          <div>
                            {module.startTime} - {module.endTime}
                          </div>
                          <div className={classes.ClassRoom}>{module.room}</div>
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                    <div
                      className={classes.AddModuleButton}
                      onClick={() => handleAddModuleClick(day)}
                    >
                      <PlusIcon />
                    </div>
                  </div>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {showEditModal && (
        <EditModule
          moduleData={editModule}
          onSubmit={handleEdit}
          onCancel={closeEditModal}
          validationSchema={validationSchema}
        />
      )}
      {showModal && (
        <div className={classes.ModalBackdrop}>
          <div className={classes.Modal}>
            <Formik
              onSubmit={handleSubmit}
              initialValues={initstate}
              validationSchema={validationSchema}
            >
              <Form className={classes.ModuleForm}>
                <h2>Add Module for {selectedDay}</h2>
                <Field
                  type="text"
                  placeholder="Module Name"
                  name="moduleName"
                />
                <ErrorMessage
                  name="moduleName"
                  component="div"
                  className={classes.error}
                />
                <Field
                  type="text"
                  placeholder="Professor Name"
                  name="professor"
                />
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
                  <button type="button" onClick={closeModal}>
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
                          {form.isSubmitting ? "...uploading" : "Add Module"}
                        </button>
                      );
                    }}
                  </Field>
                
                </div>
              </Form>
            </Formik>
            <button onClick={closeModal} className={classes.ModalCloseButton}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Schedule;
