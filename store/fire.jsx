import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
  updateEmail,
  getAdditionalUserInfo,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getFirestore,
  getDocs,
  updateDoc,
  setDoc,
  addDoc,
  deleteDoc,
  arrayUnion,
  and,
} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { setId } from "./getandset";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
const Provider = new GoogleAuthProvider();
export const storage = getStorage();
export async function signin() {
  Provider.addScope("email");
  Provider.setCustomParameters({
    prompt: "select_account",
  });
  try {
    await signInWithPopup(auth, Provider);
    const email = auth.currentUser.providerData[0].email;
    await valiedemail(email);
  } catch (e) {
    console.log(e.code);
  }
}
export async function valiedemail(email) {
  console.log(email);
  const q = query(collection(db, "users"), where("email", "==", email));

  try {
    const students = await getDocs(q);
    const uidexist = students.docs[0].data().uid
      ? students.docs[0].data().uid
      : "";

    console.log(students.docs[0].data());
    if (students.docs.length === 0) {
      await deleteUser(auth.currentUser);
      return null;
    } else {
      console.log(students.docs[0].id !== auth.currentUser.uid);
      console.log("nnnn");
      if (students.docs[0].id !== auth.currentUser.uid) {
        if (uidexist !== "") {
          await deleteUser(auth.currentUser);
          return null;
        }
        const temp1 = { email: email, uid: auth.currentUser.uid };
        const temp2 = students.docs[0].data();
        console.log(temp2);
        await setId(temp2);

        adduserinfo({ ...temp2, uid: temp1.uid });
        await deleteDoc(doc(db, "users", students.docs[0].id));
      }
    }
  } catch (e) {
    console.log(e);
  }
}

export async function signinWithUsername(username) {
  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty
      ? querySnapshot.docs[0].data()
      : { email: null };
  } catch (error) {
    return { email: null }; // Handle errors and return null
  }
}
export const creatuser = async (info) => {
  console.log(JSON.stringify(info));
  try {
    const res = await fetch(process.env.REACT_APP_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });
    console.log(res.status);
    const k = await res.json();
    console.log(k);
    return k;
  } catch (e) {
    return 500;
  }
};
export const getprofile = async () => {
  const q = query(
    collection(db, "users"),
    where("uid", "==", auth.currentUser.uid)
  );
  const data = await getDocs(q);
  return data.docs[0].data();
};
export const update_user_profile = async (info) => {
  try {
    console.log(auth.currentUser.uid);
    const userdoc = doc(db, "users", auth.currentUser.uid);
    console.log(info);
    await setDoc(userdoc, info, { merge: true });
    return "complet";
  } catch (e) {
    return e.code;
  }
};
export const Addsubject = async (info) => {
  const q = collection(db, "subjects");
  const id = await addDoc(q, info);
  updateDoc(doc(db, "users", auth.currentUser.uid), {
    subject_id: arrayUnion(id),
  });
};
export const UpdateSubject = async (info) => {
  const q = doc(db, "subjects", info.id);
  await setDoc(q, info, { merge: false });
};
const adduserinfo = (info) => {
  console.log(info);
  const docref = doc(db, "users", info.uid);
  setDoc(docref, info, { merge: true });
};
export const listnerq = (accountType, Department_id) => {
  console.log(Department_id, "kfkkedk");
  if (accountType === "Department") {
    return query(
      collection(db, "reports"),
      and(
        where("Department_id", "==", Department_id),
        where("uid", "!=", auth.currentUser.uid)
      )
    );
  } else {
    return query(
      collection(db, "reports"),
      and(
        where("Department_id", "in", Department_id),
        where("uid", "!=", auth.currentUser.uid)
      )
    );
  }
};
