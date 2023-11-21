import { and, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../store/fire";
import { useEffect, useState } from "react";
export const useFetch = (grade) => {
  const [data, setData] = useState([]);
  const [load, setload] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const f = async () => {
      setload(true);
      if (!auth.currentUser) return;
      try {
        const q = query(
          collection(db, "Subjects"),
          and(
            where("Department_id", "==", auth.currentUser.uid),
            where("grade", "==", grade)
          )
        );
        const docs = await getDocs(q);
        const temp = docs.docs.map((doc) => doc.data());
        setData(temp);
        setload(false);
      } catch (e) {
        setError(true);
      }
    };
    f();
  }, [auth.currentUser, id]);
  return { data, load, error };
};
