import {
  addDoc,
  and,
  arrayRemove,
  arrayUnion,
  collection,
  collectionGroup,
  count,
  deleteDoc,
  doc,
  getAggregateFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  sum,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./fire";
export const setId = async (info) => {
  const { universities_id, Colleges_id, accountType } = info;
  console.log(info, "info");
  console.log(info);
  switch (accountType) {
    case "University": {
      break;
    }
    case "College": {
      const docRef = doc(db, "users", universities_id);
      console.log(auth.currentUser);
      await updateDoc(docRef, {
        Colleges_id: arrayUnion(auth.currentUser.uid),
      });
    }
    case "Student": {
    }
    case "Department": {
    }
    default:
      break;
  }
};
export const deletemoduel = async (id) => {
  const p1 = deleteDoc(doc(db, "subjects", id));
  const p2 = updateDoc(doc(db, "users", auth.currentUser), {
    subjects_id: arrayRemove(id),
  });
  const q = query(
    collectionGroup(db, "subject"),
    where("id", "array-contains", id)
  );
  const docs_id = getDocs(q);
  const ids = (await docs_id).docs.map((doc) => ({ id: doc.id }));
  const p3 = ids.forEach(async (id) => {
    await deleteDoc(db, "subjects", id);
  });
  await Promise.all([p1, p2, p3]);
};
export const set_student_subject = async (info, id) => {
  await setDoc(
    doc(db, "users", auth.currentUser, "subjects", id),
    { ...info, subjects_id: id },
    { merge: true }
  );
};

export const get_Sujects = async (Deprartment_id) => {
  const q = query(
    collection(db, "subjects"),
    where("Deprartment_id", "==", Deprartment_id)
  );
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({
    label: doc.data().name,
    value: doc.data().name,
    id: doc.id,
  }));
  return data;
};
export const get_modules = async (Deprartment_id) => {
  const q = query(
    collection(db, "subjects"),
    where("Deprartment_id", "==", Deprartment_id)
  );
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  console.log(data);
  return data;
};
export const get_prog = async (levels, Deprartment_id) => {
  const q = query(
    collection(db, "programs"),
    and(
      where("Deprartment_id", "==", Deprartment_id),
      where("type", "==", +levels)
    )
  );
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  console.log(Deprartment_id, levels, "iieio");
  return data ? data : [];
};
export const get_classRooms = async (Deprartment_id) => {
  const userRef = doc(db, "users", Deprartment_id);
  console.log("works");
  const docs = await getDocs(
    query(collection(userRef, "classRooms"), orderBy("namelower", "asc"))
  );
  const data = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  console.log(data);
  return data;
};
export const setreport = async (reportinfo, Department_id) => {
  console.log(Department_id);
  try {
    const report = await addDoc(collection(db, "reports"), reportinfo);
    console.log("2");
  } catch (e) {
    console.log(3);
  }
};
export const get_progs = async (Deprartment_id) => {
  const q = query(
    collection(db, "programs"),
    where("Deprartment_id", "==", Deprartment_id)
  );
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
    return data;
 

};
export const get_sp = async (Department_id, levels) => {
  const q = query(
    collection(db, "speciality"),
    and(
      where("Department_id", "==", Department_id),
      where("levels", "==", levels)
    )
  );
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return data;
};
export const get_prof = async (professorsoid) => {
  try {
    const docs = await getDocs(
      query(collection(db, "users"), where("uid", "in", professorsoid))
    );
    const data = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(data);
    return data;
  } catch (e) {
    return [];
  }
};
export const get_Subjects = async (Deprartment_id) => {
  const q = query(
    collection(db, "subjects"),
    where("Deprartment_id", "==", Deprartment_id)
  );
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({
    ...doc.data(),
    value: doc.data().name,
    id: doc.id,
  }));
  return data;
};
export const get_active_modules = async (Deprartment_id,program,level) => {
  console.log(Deprartment_id,program,level);
  const q = query(
    collection(db, "activemodule"),
    and(
      where("Deprartment_id", "==", Deprartment_id),
      where("level", "==", level),
      where("type","==",program)
    ),
  );
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({
    ...doc.data(),
    value: doc.data().name,
    id: doc.id,
  }));
  console.log(data);
  return data ? data :[];
};
export const get_professor_modules = async (Deprartment_id,Professor_id) => {
  console.log(Deprartment_id,Professor_id);
  const q = query(
    collection(db, "activemodule"),
    and(
      where("Deprartment_id", "==", Deprartment_id),
      where("progress", "==", 100),
      where("manager","==",Professor_id)
    ),
  );
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({
    ...doc.data(),
    value: doc.data().name,
    id: doc.id,
  }));
  console.log(data);
  return data ? data :[];
};
const rand=()=>(Math.floor(26*Math.random()))
export const gen=()=>{
  let capitalLetters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];
  let x="";

  for (let index = 0; index < 10; index++) {
  x=x+capitalLetters[rand()];
  }
  return x;
 
}
export const check=async(x)=>{
  const q=query(collection(db,"users"),where("username","==",x));
  const docs=await getDocs(q);
if(docs.docs.length===0){
  return x;
}
else{
  return check(gen()); 

}
}

export const get_progs_as_college = async (Deprartment_id) => {
  const q = query(
    collection(db, "programs"),
    where("Deprartment_id", "in", Deprartment_id)
  );
  const docs = await getDocs(q);
  const data = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return data;
};
export const usernameprofile=async(id)=>{
const p1=getDoc(doc(db,"users",id))
  const p2=getDoc(doc(db,"passwords",id))
  const [doc1,doc2]=await Promise.all([p1,p2]);
  console.log(doc1.data(),doc2.data());
const password=doc1.data().username;
const username=doc2.data().password;
const info={password:password,username:username}
console.log(info);
return info;
}
export const get_prog_promise=(Deprartment_id,levels)=>{
  const q = query(
    collection(db, "programs"),
    and(
      where("Deprartment_id", "==", Deprartment_id),
      where("type", "==", +levels)
    )
  );
  return getDocs(q);
}
export const get_progs_promise=(Deprartment_id)=>{
  const q = query(
    collection(db, "programs"),
      where("Deprartment_id", "==", Deprartment_id)
    );
  return getDocs(q);
}
export const get_modules_count=async(type,level,Deprartment_id)=>{
  const q = query(
    collection(db, "activemodule"),
    and(
      where("level","==",level),
      where("type","==",type),
    where("Deprartment_id","==",Deprartment_id)
    ),  );
  return getAggregateFromServer(q,{
      toatl_ECTS:sum("ECTS"),
      count:count()
     
    });
}
export const getSchedule = (Department_id) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday", // You missed Friday in your array
    "Saturday",
  ];

  // Create a query for each day of the week
  const queries = daysOfWeek.map((day) => {
    return query(
      collection(db, "Schedule"), 
      where("Department_id", "==", Department_id),
      where("selectedDay", "==", day),orderBy("info.startTime")
    );
  });
  return Promise.all(queries.map((q) => getDocs(q)))
    .then((snapshots) => {
      // Process document snapshots for each day
      const scheduleByDay = {};
      snapshots.forEach((snapshot, index) => {
        const day = daysOfWeek[index];
        scheduleByDay[day] = snapshot.docs.map((doc) => ({...doc.data().info,id:doc.id}));
      });
      console.log(scheduleByDay);
      return scheduleByDay;
    })
    .catch((error) => {
      console.error("Error fetching schedule: ", error);
      throw error; 
    });
};
export const get_Schedule_promise=(program,levels)=>{

  const q = query(
    collection(db, "schedulemodule"),
    and(
      where("program", "==", program),
      where("level", "==", levels)
    )
  );
  return getDocs(q);
}
export const get_commite_promise=(semester,Department_id)=>{

  const q = query(
    collection(db, "Committe"),
    and(
      where("Department_id", "==", Department_id),
      where("semester", "==", semester)
    )
  );
  return getDocs(q);
}
export const get_Subjects_prog_promise =  (type,Deprartment_id) => {
  const q = query(
    collection(db, "activemodule"),
    and(
    where("Deprartment_id", "==", Deprartment_id),where(
      "type","==",type
    )
    )
  );
  return  getDocs(q);
};
