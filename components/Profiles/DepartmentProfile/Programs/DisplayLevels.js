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
    let {index}=probs;
    return(
        <div >
            <p>{numToString(+index+1) + " level"}</p>
            <p>modules number: {}</p>
            <p>Total ECTS: {}</p>
        </div>
    );
}
export default DisplayLevels;