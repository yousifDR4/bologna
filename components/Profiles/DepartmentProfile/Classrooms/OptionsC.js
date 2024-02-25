import options from "../../../../Images/option.png";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../../store/fire";
import BasicMenu from "../../../UI/Menu";
const Options=(probs)=>{
    let {classroom}=probs;
    const deleteHandler=async()=>{
        //classroom.id -> id
        const userRef=doc(db,"users",auth.currentUser.uid);
        console.log("works");
       try{
        await deleteDoc(doc(userRef,"classRooms",classroom.id));
        probs.updateTable();
       }
       catch(e){

       }

    }
    const editHandler=()=>{
        probs.showAdd(true,classroom);
    }
    return(
        <BasicMenu menuItems={[{title:"Delete",handleClick:()=>deleteHandler()},{title:"Edit",handleClick:editHandler}]} menuTitle={<img src={options}/>} />
    )
}
export default Options;