import { useState } from "react";
import classes from "./BachelorFour.module.css";
import { get_prog_promise } from "../../../../store/getandset";
import { useSelector } from "react-redux";
import Loader from "../../../UI/Loader/Loader";
import { useQuery } from "react-query";
const HOC = (Orgianlcomponet) => {
  const Newcomponet = (probs) => {
    const { ECTS, levels } = probs;
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const promise = () => get_prog_promise(Department_id, levels);
    const {
      data: program,
      isLoading,
      error,
    isFetching,  
    } = useQuery(`ECTS:${ECTS}levels:${levels} department:${Department_id}`, promise, {
      enabled: !!Department_id,
      refetchOnWindowFocus:false,
      staleTime:60*1000
    });
   console.log("level",levels);
    const [showAddProgram, setShowAddProgram] = useState(false);
    const clickHandler = () => setShowAddProgram(true);
  console.log(isFetching,"isFetching",isLoading,"isLoading");
    if ((isLoading || !Department_id)) {
      console.log(Department_id);
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
          program={program.empty? { activated: false } : { ...program.docs[0].data(), id: program.docs[0].id }}
          showAddProgram={showAddProgram}
          clickHandler={clickHandler}
          setShowAddProgram={setShowAddProgram}
        />
      );
  };
  return Newcomponet;
};
export default HOC;
