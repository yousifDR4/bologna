import { and, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../store/fire";
import { useEffect, useState } from "react";

export const useFetch = (grade) => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is still mounted
    const fetchData = async () => {
      setLoad(true);
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
        // Only update state if the component is still mounted
        if (isMounted) {
          const temp = docs.docs.map((doc) => doc.data());
          setData(temp);
          setLoad(false);
        }
      } catch (e) {
        // Only update state if the component is still mounted
        if (isMounted) {
          setError(true);
        }
      }
    };
    fetchData();

    // Cleanup function
    return () => {
      isMounted = false; // Component is unmounting, update the flag
      // Additional cleanup code if needed, e.g., unsubscribe from a subscription
    };
  }, [auth.currentUser, grade]);

  return { data, load, error };
};
