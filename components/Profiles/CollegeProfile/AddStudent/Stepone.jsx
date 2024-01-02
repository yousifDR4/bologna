
import Smallinput from "./Smallinput";
import Largeinput from "./Largeinput";
import { ErrorMessage, Field, Form } from "formik";
import Button from "./Button";
import SelectLevel from "./SelectLevel";
import SelectProgram from "./SelectProgram";
const Stepone = ({departments}) => (
    
    <Form className="parent" autoComplete="on">
      <Smallinput name="firstname" word="first name" type="text" required="*"/>
      <Smallinput name="lastname" word="last name" type="text" required="*"/>
      <Smallinput name="birth" word="birth day" type="date" />
      <span className="spanflex">
        <label htmlFor="sex" className="mylabel">
          sex
        </label>
        <Field as="select" name="sex" className="myselect">
          <option value={"male"}>male</option>
          <option value={"female"}>female</option>
        </Field>
      </span>
      <span className="spanflex">
        <label htmlFor="department" name="department" className="mylabel">
        {true&& (<span className="spancolor">*</span>)}
          Department
        </label>
        <Field as="select" className="myselect" name="department">
          {departments.length > 0 ? (
            departments.map((prog) => (
              <option key={prog.name} value={prog.id}>
                {prog.name}
              </option>
            ))
          ) : (
            <></>
          )}
          <option key={"null"} value={""}>
            no department!
          </option>
        </Field>
        <ErrorMessage name={"department"} component="div" />
      </span>
      <SelectProgram />
      <SelectLevel />
      <Largeinput word="email" name="email" type="text" required="*"/>
      <Largeinput word="password" name="password" type="password"required="*" />
      <Largeinput word="number" name="number" type="text" />
      <Largeinput word="mother name" name="mothername" type="text" />
      <span className="buttonflex">
        <label htmlFor="button" className="mylabel"></label>
        <Button/>
      </span>
    </Form>
  );
  export default Stepone;