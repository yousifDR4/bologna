import { arrayUnion, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, db } from "./fire";
export const getunv=async()=>{
 const ref=collection(db,"universities");
 const q=query(ref,where("name","!=",null))
 const docs=await getDocs(q);
 const data=docs.docs.map((d)=>d.data());
 return data;
}
export const setId=async (info)=>{
const {universities_id,Colleges_id,accountType}=info;
console.log(info,"info");
console.log(info);
switch (accountType) {
    case "University":{
   break
    }
   case "College" :{
    const docRef=doc(db,"users",universities_id);
    console.log(auth.currentUser);
    await updateDoc(docRef, {
        Colleges_id: arrayUnion(auth.currentUser.uid)
      });
   }
   case "Student":{

   }
   case "Department":{

   }
    default:
        break;
}
}