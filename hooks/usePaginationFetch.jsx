import { useEffect, useState } from "react";
import { auth, db } from "../store/fire";
import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";

export const usePaginationFetch = (nextdoc, firstfetch,limitNumber) => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        if (nextdoc === null && firstfetch === true) {
          const q = query(
            collection(db, "users"),
            where("accountType", "==", "University"),
            orderBy("name"),
            limit(limitNumber)
          );
          const docs1 = await getDocs(q);
          const d1 = docs1.docs;
          console.log(d1);
          setData(d1);
        } else {
          const q = query(
            collection(db, "users"),
            where("accountType", "==", "University"),
            orderBy("name"),
            limit(limitNumber),
            startAfter(nextdoc)
          );
          const docs1 = await getDocs(q);
          if(!docs1.empty){
          const d1 = docs1.docs;
          setData(d1);
          }
          else{
          
            setData([])
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
  }, [nextdoc]);

  return { data, error, load };
};

/// logic

