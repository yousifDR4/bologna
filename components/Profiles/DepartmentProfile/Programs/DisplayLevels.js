import { useQuery } from "react-query";
import { get_modules_count } from "../../../../store/getandset";
import { collection } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function numToString(num){
    let s;
    switch (num){
    case 1:
        s="first"
        break;
    case 2:
        s= "second"
        break;
    case 3:
            s= "third"
            break;
    case 4:
         s= "fourth"
        break;
        case 5:
            s= "fifth"
            break;
    case 6:
        s="sixth"
        break;
    }
    return s;
    }
const DisplayLevels=(probs)=>{
    let {index,type}=probs;
    const profile = useSelector((state) => state.profile.profile);
    const Department_id = profile.Department_id;
    const promise=()=>get_modules_count(type,index+1,Department_id);
    const {data,error,isLoading}=useQuery(`type:${type}level:${index}`,promise,{
        enabled:!!Department_id
    });
    // if (!isLoading) {
    //     console.log("index",index+1);
    //     console.log(data);
    // }    
    console.log(index,type);

    return(
        <div >
            <p>{numToString(+index+1) + " level"}</p>
            <p>modules number: {isLoading?0:data.data().count}</p>
            <p>Total ECTS:{isLoading?0:data.data().toatl_ECTS}</p>
        </div>
    );
}
export default DisplayLevels;