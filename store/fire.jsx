import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup,GoogleAuthProvider,deleteUser,updateEmail, getAdditionalUserInfo } from 'firebase/auth';
import { collection,doc,getDoc,query,where,getFirestore,getDocs, updateDoc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import {getStorage,ref }from "firebase/storage"
import { setId } from './getandset';
const firebaseConfig = {
  apiKey: "AIzaSyDsvuaRLVbper6mlttMm4nX2KTUWg63v9Q",
  authDomain: "bola-82857.firebaseapp.com",
  projectId: "bola-82857",
  storageBucket: "bola-82857.appspot.com",
  messagingSenderId: "769132993839",
  appId: "1:769132993839:web:337cd155f3c2a6105615da"
};
 
// Initialize Firebase
const app=initializeApp(firebaseConfig);
export const auth = getAuth();
export const db=getFirestore(app);
const Provider= new GoogleAuthProvider(); 
export const storage=getStorage();
export async function signin () {
  Provider.addScope('email');
  Provider.setCustomParameters({
    prompt: 'select_account'
  }); 
  try{
  await ( signInWithPopup(auth,Provider))
  const email=auth.currentUser.providerData[0].email;
   await valiedemail(email); 
  }
  catch(e){console.log(e.code);}
  }
export async function valiedemail(email) {
  console.log(email);
const q=query(collection(db,"users"),where("email","==",email));
console.log(auth.currentUser.uid);
console.log(email);
try{
const students=await getDocs(q);
console.log(students.docs[0].data());
if(students.docs.length===0){
  console.log("hhh");
await deleteUser(auth.currentUser);
return null;
}
else{
  console.log(students.docs[0].id!==auth.currentUser.uid);
  console.log("nnnn");
  if(students.docs[0].id!==auth.currentUser.uid){
    const temp1={email:email,uid:auth.currentUser.uid}
    const temp2=students.docs[0].data();
    console.log(temp2);
   await setId(temp2)
    console.log(temp2);
     adduserinfo({...temp2,uid:temp1.uid});
   await deleteDoc(doc(db,"users",students.docs[0].id))
  }
}
} 
catch(e) {
console.log(e);
}
}

export async function signinWithUsername(username) {
  try {
      const q = query(collection(db,"users"), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs[0].data());
      return  !querySnapshot.empty ? querySnapshot.docs[0].data():"not found" 
  } catch (error) {
    console.error(error);
    return null; // Handle errors and return null
  }
}
export const creatuser= async(info)=>{
  
  
console.log(JSON.stringify(info));
 const res= await fetch ("http://localhost:4000/create",{method:"POST",
   headers: {
   'Content-Type': "application/json"},body: JSON.stringify(info)})
   
  const k=await res.json()
   return k;
}

export const getprofile=async ()=>{
  try{
const q=query(collection(db,"users"),where("uid","==",auth.currentUser.uid));
const data=await getDocs(q);
console.log(data.docs[0].data());
return data.docs[0].data();
  }
  catch(e){
    console.log(e);
  }
}
export const update_user_profile=async (info)=>{
  try{
    console.log(auth.currentUser.uid);
const userdoc=doc(db,"users",auth.currentUser.uid);
console.log(info);
await setDoc(userdoc,info,{"merge":true});
   return "complet";
  }
  catch(e){
    return e.code;
  }
}

const SubjectPath=(info)=>{
  const{universities_id,college_id,department_id,subject_id}=info;
  const path=`universities/${universities_id}/colleges/${college_id}/department/${department_id}/subjects /${subject_id}`;
  return path;
}
export const getsubject=async (info)=>{
  try{
    const q=doc(db,SubjectPath(info));
   const subject=await getDoc(q);
   return subject;
  }
  catch(e){
   return e;
  }
}
export const Addsubject=async (info)=>{
  const q=doc(db,SubjectPath(info));
  await setDoc(q,info,{"merge":true});
  
}
export const UpdateSubject=async (info)=>{
  const q=doc(db,SubjectPath(info));
  try{
  await setDoc(q,info,{"merge":false});
  return "ok";
  }
  catch (e){
    return e;
  }
}
const adduserinfo=(info)=>{
  console.log(info);
 const docref=doc(db,"users",info.uid)
  setDoc(docref,info,{merge:true});
}


