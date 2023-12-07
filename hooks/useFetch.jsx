import { doc ,query,where,getDocs,collection} from "firebase/firestore"
import { auth ,db} from "../store/fire"
import { useEffect, useState } from "react"
export const useFetch=(arr,reload)=>{
const [data,setData]=useState([]);
const [load,setload]=useState(false);
const [error,setError]=useState(false);
useEffect(() => {
    const f = async () => {
        setload(true)
      if (!auth.currentUser) return;
      try {
        const q= query(collection(db,"users"),where("uid","in",arr)) 
        const colleges=await getDocs(q);
        let data=colleges.docs.map((college)=>college.data());
        console.log(data);
        setData(data);
       
       }
       catch (e) {
        setError(true)
      }
      setload(false);
    };
    setload(false);
    f();
  }, [arr,reload]);
  return{data,load,error}
}