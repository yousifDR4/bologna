import { useEffect, useState } from "react";
import { auth, db } from "../store/fire";
import {collection,getDocs, limit,orderBy, query,startAfter,} from "firebase/firestore";
export const PaginationFetch = (collectionType, nextdoc) => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const f = async () => {
      try {
        if (nextdoc === null) {
          setLoad(true);
          const q1 = query(
            collection(db, collectionType),
            orderBy("name"),
            limit(5)
          );
          const docs1 = await getDocs(q1);
          const d1 = docs1.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setData(d1?d1:[]);
        } else {
          const q1 = query(
            collection(db, collectionType),
            orderBy("name"),
            limit(5),
            startAfter(nextdoc)
          );
          const docs1 = await getDocs(q1);
          d1 = docs1.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setData(d1?d1:[]);
        }
      } catch (e) {
        setError(true);
      }
      setLoad(false);
    };
    f();
    return () => f();
  }, [nextdoc, collectionType, auth.currentUser]);
  return { data, error, load };
};
/// logic
const [nextdoc, setNextdoc] = useState(null);
const [students,setStudents]=useState([])
useEffect(() => {
 if(data.length>0 ){
setStudents ((prev)=>[...prev,data])
setNextdoc(data[4]);
 }
 
}, [setNextdoc]);
