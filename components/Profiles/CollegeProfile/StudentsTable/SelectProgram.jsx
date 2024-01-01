import { ErrorMessage, Field, FormikContext, useFormikContext } from "formik";
import "./EditStudent.css";
import { useContext, useEffect } from "react";
import { get_prog, get_progs } from "../../../../store/getandset";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../../../store/fire";
let mount = false;
const SelectProgram = (probs) => {
  const formik = useFormikContext();
  useEffect(() => {
    try {
      const f = async () => {
        console.log(mount, "mount");
        if (formik.values.department !== "") {
          if (formik.values.programs.length > 0) {
            const temp = formik.values.programs.filter(
              (prog) => prog.Deprartment_id === formik.values.department
            ).length;
            console.log(temp, "my logic value");
            if (temp > 0) return;
          }
          console.log("fetch program");
          const d = await get_progs(formik.values.department);
          formik.setFieldValue("programs", d);
          console.log(d, "programs");
          formik.setFieldValue("maxlevel", 0);
          if (d.length === 0) {
            formik.setFieldValue("program", "");
            formik.setFieldValue("level", "");
            formik.setFieldValue("maxlevel", 0);
          }
           else
          formik.setFieldValue("program", "");
          console.log("lol");
          console.log("keowfk33pewrod32ko32opq]");
        } else {
        
          formik.setFieldValue("program", "");
          formik.setFieldValue("programs", "");
        }
      };
      f();
    } catch (e) {
    } finally {
    }
  }, [formik.values.department]);
  useEffect(() => {
    try {
      if (formik.values.program !== "" && formik.values.programs.length > 0) {
        const id = formik.values.program;
       console.log(formik.values.program);
       console.log(formik.values.programs[0].id);
        const level = formik.values.programs.filter((prog) => prog.id === id)[0].type
         console.log(level);
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
      console.log("000000000000000");
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
      {true&& (<span className="spancolor">*</span>)}
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
        disabled={formik.values.department === ""}
        onAbort={formik.validateOnChange}
      >
        <option value="">
          {formik.values.department !== ""
            ? "no selected program"
            : "no department selected"}
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
      
      <ErrorMessage name={"program"} component="div"/>
    </span>
      

  );
};
export default SelectProgram;
