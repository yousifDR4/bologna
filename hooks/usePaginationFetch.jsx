import { useEffect, useState } from "react";
import { auth, db } from "../store/fire";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
export const usePaginationFetch = (nextdoc,
firstfetch,limitNumber, updateRef,q1,q2) => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        if (nextdoc === null && firstfetch === true) {
          console.log(nextdoc, firstfetch, limitNumber);

          const docs1 = await getDocs(q1);
          const d1 = docs1.docs;
          console.log(d1);
          setData(d1);
        } else {
          const docs1 = await getDocs(q2);
          if (!docs1.empty) {
            console.log(nextdoc);
            const d1 = docs1.docs;
            setData(d1);
          } else {
            setData([]);
          }
        }
      } catch (e) {
        setError(true);
        console.error("Error fetching data:", e);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, [nextdoc, updateRef]);
  return { data, error, load };
};
/// logic
