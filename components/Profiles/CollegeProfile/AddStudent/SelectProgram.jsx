import { ErrorMessage, Field, FormikContext, useFormikContext } from "formik";
import "./AddStudent.css";
import { useContext, useEffect } from "react";
import { get_prog, get_progs } from "../../../../store/getandset";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../../../store/fire";
const SelectProgram = () => {
  const formik = useFormikContext();
  console.log(formik.values.department);
  useEffect(() => {
    const f = async () => {
      if (formik.values.department !== "") {
        const d = await get_progs(formik.values.department);
        formik.setFieldValue("programs", d);
        console.log(d,"programs");
        if (d.length===0) {
          formik.setFieldValue("program", "");
        }
        console.log("programs fetch");
      } else {
        formik.setFieldValue("programs", "");
        formik.setFieldValue("program", "");
      }
    };
    f();
  }, [formik.values.department]);
  useEffect(() => {
    try {
      if (formik.values.program !== "" && formik.values.programs.length > 0) {
        const id = formik.values.program;

        const level = formik.values.programs.filter((prog) => prog.id === id)[0]
          .type;
        formik.setFieldValue("maxlevel", level);
      } else {
        formik.setFieldValue("maxlevel", 0);
      }
    } catch (e) {
      console.log(e);
    }
  }, [formik.values.program]);
  const changemaxlevel = (e) => {
    if (e.target.value === "") {
      formik.setFieldValue("maxlevel", 0);
      return;
    }

    const max = formik.values.programs.filter(
      (prog) => prog.id === e.target.value
    )[0].type;
    console.log(max);
    formik.setFieldValue("maxlevel", max);
  };
  return (
    <span className="spanflex">
      <label htmlFor="program" className="mylabel" name="program">
        Program
      </label>
      <select
        className="myselect"
        name="program"
        onChange={(e) => {
          formik.handleChange(e);
          changemaxlevel(e);
        }}
        value={formik.values.program}
        disabled={formik.values.department===""}
      >
        <option value="">
          {formik.values.department !== "" ? "no selected program" : "no department selected"}
        </option>
        {formik.values.programs.length > 0 ? (
          formik.values.programs.map((prog) => (
            <option key={prog.name} value={prog.id}>
              {prog.name}
            </option>
          ))
        ) : (
          <></>
        )}
      </select>
    </span>
  );
};
export default SelectProgram;
