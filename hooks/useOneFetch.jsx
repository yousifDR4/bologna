import { doc  ,getDoc} from "firebase/firestore"
import { auth ,db} from "../store/fire"
import { useEffect, useState } from "react"
export const useFetch=(id)=>{
const [data,setData]=useState([]);
const [load,setload]=useState(false);
const [error,setError]=useState(false);
useEffect(() => {
    const f = async () => {
        setload(true)
      if (!auth.currentUser) return;
      try {
        const temp=await getDoc(doc(db,"users",id));
        let data=temp.data()
        setData(data);
       }
       catch (e) {
        setError(true)
      }
      setload(false);
    };
    f();
  }, [auth.currentUser,id]);
  return{data,load,error}
}