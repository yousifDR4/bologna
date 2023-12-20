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
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [update, setUpdate] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
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
  if (loading) {
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
                    {speciality.prerequisite.map((mod) => {
                      return mod + "  ";
                    })}
                  </td>
                  <td>{speciality.stuedentNum}</td>
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
  } else {
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
