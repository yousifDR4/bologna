import { useEffect, useState } from "react";
import Loader from "../../../UI/Loader/Loader";
import addIcon from "../../../../Images/add.png";
import classes from "./Speciality.module.css";
import AddSpeciality from "./AddSpeciality";
import {
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../store/fire";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { useQueries, useQuery } from "react-query";
import { get_prog_promise } from "../../../../store/getandset";
const stSp = [
  {
    name: "ICE",
    requestedModules: ["Physics", "Math"],
    stuedentNum: 0,
    id: "01",
  },
];
const Speciality = (probs) => {
  const { program } = probs;
  console.log(program);
 
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [update, setUpdate] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const promise = () => get_prog_promise(Department_id, program,"hger");
    const {
      data: programObj={},
      isLoading,
      error,
    isFetching,  
    } = useQuery(`levels:${program} department:${Department_id}`, promise, {
      enabled: (!!Department_id && !!program),
      refetchOnWindowFocus:false,
      staleTime:60*1000,
      select:(data)=>{
          console.log(data.docs[0]);
        return data.docs[0] ? { ...data.docs[0].data(), id: data.docs[0].id } :{}
        
    }
    });
console.log(programObj);
  useEffect(() => {
    if(!Department_id)
    return;
    const fetchData = async () => {
      setLoading(true);
       try {
      const q = query(
        collection(db, "speciality"),
        and(
          where("Department_id", "==", Department_id),
          where("levels", "==", program)
        )
      );
        // Access data for each document snapshot in the array
        const p = await getDocs(q);
        console.log(p, "p");
        const info = p.docs.map((e) => ({ ...e.data(), e: e.id }));

        console.log(info);

        setSpecialities((prev) => [...prev, ...info]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [Department_id,update]);
  const updateSpeciality = () => {
    setUpdate((prev) => !prev);
    setSpecialities([]);
  };
  if (loading || isLoading) {
    return <div className={classes.loader}><Loader /></div>;
  } else if (specialities.length > 0) {
    return (
      <>
        <table className={classes.styledtable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Requested Modules</th>
              <th>Students Number</th>
            </tr>
          </thead>
          <tbody>
            {specialities.map((speciality) => {
              return (
                <tr key={speciality.id}>
                  <td>{speciality.name}</td>
                  <td>
                    {speciality.prerequisite.map((mod,index) => {
                      return mod + (index === speciality.prerequisite.length-1 ?"  ":", ");
                    })}
                  </td>
                  <td>{speciality.stuedentNum ?speciality.stuedentNum :0 }</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {showAdd && (
          <AddSpeciality
            showAdd={setShowAdd}
            program={program}
            updateSpeciality={updateSpeciality}
          />
        )}
        {!showAdd && (
          <div className={classes.add} onClick={() => setShowAdd(true)}>
            <img src={addIcon} alt="" />
            <p>Add a new speciality</p>
          </div>
        )}
      </>
    );
  }else if(!programObj?.activated){
return(

    <Typography width="100%" textAlign="center" color="text.secondary"> Program is not Activated!</Typography>
);
  } 
  else {
    return (
      <>
        {showAdd && <AddSpeciality showAdd={setShowAdd} program={program} />}
        {!showAdd && (
          <div className={classes.add} onClick={() => setShowAdd(true)}>
            <img src={addIcon} alt="" />
            <p>Add a new speciality</p>
          </div>
        )}
      </>
    );
  }
};
export default Speciality;
