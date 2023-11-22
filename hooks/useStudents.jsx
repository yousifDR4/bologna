import { collection, doc,onSnapshot,query,where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../store/fire";
export const useStudensts=(s)=>{
const [data,setData]=useState({});
const [error,setError]=useState(false);
useEffect(() => {
    const q =  query(collection(db,"users"),where("accountType","==","College"));
    try{
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {       
        if (change.type==="modified") {
        setData([...s,change.doc.data()]);
        console.log(change.doc.data());
        }
      });
    });
    return () => unsubscribe();
}catch(e){
    setError(e)
}
  }, []);

 return {data,error}
}