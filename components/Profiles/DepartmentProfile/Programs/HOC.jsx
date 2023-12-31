import { useEffect, useState } from "react";
import classes from "./BachelorFour.module.css";
import AddProgram from "./AddProgram";
import PreviewBachelor from "./PreviewBachelor";
import { get_prog, get_prog_promise } from "../../../../store/getandset";
import { auth } from "../../../../store/fire";
import { useSelector } from "react-redux";
import Loader from "../../../UI/Loader/Loader";
import { useQuery } from "react-query";
const HOC = (Orgianlcomponet) => {
  const Newcomponet = (probs) => {
    const { ECTS, levels } = probs;
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const promise=()=> get_prog_promise(Department_id, levels);
    const {
      data: program,
      isLoading,
      error,
    } = useQuery(
      levels,
    promise,
      {
       
        enabled: !!Department_id,
        staleTime: 2 * (60 * 1000),
      }
    );
    const [showAddProgram, setShowAddProgram] = useState(false);
    const clickHandler = () => setShowAddProgram(true);
    if (isLoading || !Department_id) {
      return (
        <div className={classes.loading}>
          <Loader />
        </div>
      );
    } else
      return (
        <Orgianlcomponet
          ECTS={ECTS}
          levels={levels}
          program={
            program.empty ? { activated: false } : program.docs[0].data()
          }
          showAddProgram={showAddProgram}
          clickHandler={clickHandler}
          setShowAddProgram={setShowAddProgram}
        />
      );
  };
  return Newcomponet;
};
export default HOC;
