import React, { useState, useEffect, useReducer, cloneElement } from "react";
import { auth, creatuser, db } from "../../../../store/fire";
import Select from "react-select";
import classes from "./ModuleInfo.module.css";
import { getIdToken } from "firebase/auth";
import { useSelector } from "react-redux";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { get_Sujects } from "../../../../store/getandset";
let modul = [
  { value: "physics", label: "Physics" },
  { value: "mathII", label: "MathII" },
  { value: "humanrights", label: "Human Rights" },
];

const intilistate = {
    program:"",
    module:"",
    ECTS:0,
    level:0,
    manager:"",
    revisor:"",
    acceptanceDate:"",
    lab:"",
    theory:"",
    online:"",
    exercises:""
};
function reducer(state, action) {
  let newstate = {};
  switch (action.type) {
    case "input":
      newstate = { ...state, [action.input]: action.value };
      break;
    case "reset":
      newstate = intilistate;
    default:
  }
  return newstate;
}

const ModuleInfo = (probs) => {
    let {form,setForm,setFormIsValid}=probs;
  const [modules, setModules] = useState(modul);
  const [programs,setPrograms]=useState([]);
  const [speciality,setSpeciality]=useState([]);
  const [professors,setProfessors]=useState([]);
  const [classrooms,setClassrooms]=useState([]);
    const [selectedProgLevels,setSelectedProgLevels]=useState(0);
    const [spYear,setSpYear]=useState(100);
  const [state, dispatch] = useReducer(reducer, intilistate);
  const inputsValid = {
    program:form.program.trim() !== "",
    module:form.module.trim() !== "",
    ECTS: form.ECTS > 0,
    level:form.level > 0,
    manager:form.manager.trim() !== "",
    revisor:form.revisor.trim() !== "",
    acceptanceDate:form.acceptanceDate.trim() !== "" ,
    lab: form.lab.trim() !== "",
    theory:form.theory.trim() !== "", 
    online:form.online.trim() !== "",
    exercises:form.exercises.trim() !== ""
  };
  const profile = useSelector((state) => state.profile.profile);
  const Department_id=profile.Department_id;
  useEffect(() => {
    if (
      inputsValid.program &&
      inputsValid.module &&
      inputsValid.ECTS && inputsValid.level&&
      inputsValid.manager && inputsValid.revisor && inputsValid.acceptanceDate &&
      inputsValid.acceptanceDate && inputsValid.lab && inputsValid.theory &&
      inputsValid.online && inputsValid.exercises
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [inputsValid]);

  function onchange(e) {
    if(e.target.name === "program"){
        setSelectedProgLevels(()=>{
            let x=[];
            console.log(e.target.value)
           let p= programs.filter((p)=> p.type == e.target.value);
           setSpYear(p[0].specialtyYear);
            for(let i=1; i <=e.target.value; i++){
            x.push(<option value={i}>{i}</option>)
        }
            return x;
        }
        );
  
    }
    setForm((prev)=>{
        console.log(prev);
        return {...prev,[e.target.name]:e.target.value};
});
  }
  useEffect(() => {
    // load modules , classrooms , speciality,program,professor
    if (!auth.currentUser) return;
    console.log("NNNN");
    const f = async () => {
      const a = await get_Sujects(Department_id);
      setModules(a);
      setProfessors([]);
      setClassrooms([]);
      setSpeciality([]);
      setPrograms([{
        name:"Bachelor",
        type:4,
        specialtyYear:2
      },{
        name:"Bachelors",
        type:6,
        specialtyYear:2
      }]);
    };
    f();
  }, [auth.currentUser]);
  return (
    <div className={`${classes.container}`}>
      <button onClick={() => probs.showAddProgram(false)}>X</button>
      <form action="" className=" form">
   
        <div className={classes.fields}>
          <span>
            <label htmlFor="email">
              Program<span className={classes.star}>*</span>
            </label>
            <select
              name="program"
              type=""
              onChange={onchange}
              value={form.program}
            >
            <option value={""} disabled hidden>select...</option>
             {
                programs.map(prog=>{
                    return <option value={prog.type}>{prog.name}</option>
                })
             }
            </select>
          </span>
          <span>
            <label className="text">
               Module <span className={classes.star}>*</span>
            </label>
            <select
              name="module"
              type=""
              onChange={onchange}
              value={form.module}
            >
            <option value={""} disabled hidden>select...</option>
             {
                modules.map(mod=>{
                    return <option value={mod.id}>{mod.name}</option>
                })
             }
            </select>
          </span>
          <span>
            <label className="text">
              ECTS<span className={classes.star}>*</span>
            </label>
            <input
              name="ECTS"
              type="number"
              onChange={onchange}
              value={form.ECTS}
/>
          </span>
          <span>
            <label className="text">
              Level<span className={classes.star}>*</span>
            </label>
            <select
              name="level"
              type="number"
              onChange={onchange}
              value={form.level}
            >
            <option value={""} disabled hidden>select...</option>
            {selectedProgLevels}
            </select>
          </span>

         {+form.level >=  +spYear &&  <span>
            <label className="text">
              Speciality<span className={classes.star}>*</span>
            </label>
            <select
              name="speciality"
              type=""
              onChange={onchange}
              value={form.speciality}
            >
            <option value={""} disabled hidden>select...</option>
             {
                speciality.map(sp=>{
                    return <option value={sp.id}>{sp.name}</option>
                })
             }
            </select>
          </span>}
          <span>
            <label className="text">
              Module Manager
              <span className={classes.star}>*</span>
            </label>
            <select
              name="manager"
              type=""
              onChange={onchange}
              value={form.manager}
            >
            <option value={""} disabled hidden>select...</option>
             {
                professors.map(p=>{
                    return <option value={p.id}>{p.name}</option>
                })
             }
            </select>
          </span>
          <span>
            <label className="text">
            Module Revisor<span className={classes.star}>*</span>
            </label>
            <select
              name="revisor"
              type=""
              onChange={onchange}
              value={form.revisor}
            >
            <option value={""} disabled hidden>select...</option>
             {
                professors.map(p=>{
                    return <option value={p.id}>{p.name}</option>
                })
             }
            </select>
          </span>
          <span>
            <label className="text">
              Acceptance Date<span className={classes.star}>*</span>
            </label>
            <input
              name="acceptanceDate"
              type="date"
              onChange={onchange}
              value={form.acceptanceDate}
            />
          </span>
          <span>
            <label className="text">
              Lab<span className={classes.star}>*</span>
            </label>
            <select
              name="lab"
              type=""
              onChange={onchange}
              value={form.lab}
            >
            <option value={""} disabled hidden>select...</option>
             {
                classrooms.map(c=>{
                    return <option value={c.id}>{c.name}</option>
                })
             }
            </select>
          </span>
          <span>
            <label className="text">
              theory<span className={classes.star}>*</span>
            </label>
            <select
              name="theory"
              type=""
              onChange={onchange}
              value={state.theory}
            >
            <option value={""} disabled hidden>select...</option>
             {
                classrooms.map(c=>{
                    return <option value={c.id}>{c.name}</option>
                })
             }
            </select>
          </span>
          <span>
            <label className="text">
              Exercises<span className={classes.star}>*</span>
            </label>
            <select
              name="exercises"
              type=""
              onChange={onchange}
              value={state.exercises}
            >
            <option value={""} disabled hidden>select...</option>
             {
                classrooms.map(c=>{
                    return <option value={c.id}>{c.name}</option>
                })
             }
            </select>
          </span>
        </div>
      </form>
    </div>
  );
};
export default ModuleInfo;
