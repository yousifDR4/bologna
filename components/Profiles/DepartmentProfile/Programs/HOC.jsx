import { useEffect, useState } from "react";
import classes from "./BachelorFour.module.css";
import AddProgram from "./AddProgram";
import PreviewBachelor from "./PreviewBachelor";
import { get_prog } from "../../../../store/getandset";
import { auth } from "../../../../store/fire";
import { useSelector } from "react-redux";
import Loader from "../../../UI/Loader/Loader";
// let Program1={
//     activated:true,
//     ECTS:240,
//     levels:4,
//     name:"ICE Bachelor's degree",
//     code:"BSc-ICE",
//     eveningStudy:true,
//     summerInternhsip:true,
//     summerInternhsipYear:3,
//     speciality:true,
// }
const HOC = (Orgianlcomponet) => {
  const Newcomponet = (probs) => {
   const {ECTS,levels}=probs;
   console.log(levels,"levelddddddds");

    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const [program, setProgram] = useState({});
    const [showAddProgram, setShowAddProgram] = useState(true);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    console.log(program);
    console.log(showAddProgram);
    useEffect(() => {
      if (!auth.currentUser) return;
      if (!Department_id) return;
      //load Program (if exist (Activated))]
      const f = async () => {
        try {
          setLoading(true);

          const d = await get_prog(levels, Department_id);
          console.log(d);
          const obj = d[0];
          console.log(obj, "kkkkkkkkkkkk");
          if (obj && +obj.type === +levels) {
            setProgram(obj);
            console.log(obj.type, levels);
            console.log("first condition workssss");
            console.log(obj,program);
          } else setProgram({ activated: false });
          setShowAddProgram(false);
        } catch (e) {
          setError(true);
          setProgram({ activated: false });
        } finally {
          setLoading(false);
          console.log(program);
        }
      };
      f();
    }, [profile]);
    const clickHandler = () => setShowAddProgram(true);
    if (loading) {
        return (
          <div className={classes.loading}>
            <Loader />
          </div>
        );
      }
    return (
      <Orgianlcomponet
        ECTS={ECTS}
        levels={levels}
        program={program}
        showAddProgram={showAddProgram}
        clickHandler={clickHandler}
        setShowAddProgram={setShowAddProgram}
      />
    );
  }; 
  return Newcomponet;
};
export default HOC;
