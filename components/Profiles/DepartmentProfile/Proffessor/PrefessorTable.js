import { useEffect, useState } from "react";
import classes from "./ProfessorTable.module.css";
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import {
  HeaderCellSort,
  useSort,
} from "@table-library/react-table-library/sort";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../../../store/fire";
import { useSelector } from "react-redux";
import { TableLoader } from "../StudentsModuleRegisteration";
import Loader from "../../../UI/Loader/Loader";
import { Typography } from "@mui/material";
import BasicMenu from "../../../UI/Menu";
import { Edit, MoreHoriz } from "@mui/icons-material";
import EditProffessor from "./EditProfessor";
import { useNavigate } from "react-router-dom";
const key = "Compact Table";

const ProfessorTable = () => {
  const profile = useSelector((state) => state.profile.profile);
  const [modules, setModules] = useState([]);
  const [professors,setProfessors]=useState([]);
  const [showEdit, setshowEdit] = useState(false);
  const [loading,setLoading]=useState(true);
  const [selectedProfessor, setselectedProfessor] = useState({});
  const navigate=useNavigate();
  useEffect(() => {
    //fetch
    setModules([]);
    const f=async()=>{
      try{
        console.log(profile);
      if(!profile.professors)
      return;
    else if(profile.professors.length === 0){
      return;
    }
      console.log(profile.professors);
     const m= profile.professors
   const p1=getDocs(query(collection(db,"users"),where("uid","in",profile.professors)));
   const p2=m.map(async(id)=>{
  const t=await getDoc(doc(db,"passwords",id))
    return  {password: t.data().password,id:t.id}
  });
  const [d1,d2]=await Promise.all([p1,p2]);
  if(d1.docs){
    let d=d1.docs.map((doc)=>({...doc.data(),id:doc.id}));
    setProfessors(d);
  }
  const arr1=d1.docs.map((doc)=>({name:doc.data().username,id:doc.id}))
const d3=await Promise.all(d2);
console.log(arr1);
console.log(d3);
const newpbj=[];
arr1.map((professor)=>{
  newpbj.push(professor);
})
const compose=newpbj.map((obj)=>{
  let m=d3.filter((obj2)=>(obj2.id===obj.id))[0].password;
  console.log(m);
  return obj={...obj,password:m}
})
console.log(newpbj);
setModules(compose)
}
catch(e){
console.log(e);
} 
finally{
  setLoading(false);
}
    }

f();

  }, [auth.currentUser]);
  const data = {
    nodes: modules,
  };
  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortFns: {
        NAME: (array) =>  [...array].sort((a, b) => a.name.localeCompare(b.name)),
        MIDTERM: (array) =>
        [...array].sort((a, b) => a.midtermExamHours - b.midtermExamHours),
        ENDTERM: (array) =>
        [...array].sort((a, b) => a.endtermExamHours - b.endtermExamHours),
      },
    }
  );
  const theme = useTheme([
    getTheme(),
    {
      Table: `
  position:unset;
  `,
    },
    {
      HeaderRow: `
    font-size: 16px;
    font-family:GraphikLight;
    background-color: #F5F5F5;
    padding:0;
    
  `,
    },
    {
      HeaderCell: `
&:nth-of-type(5){
text-align:center;
}
  `,
    },
    {
      Row: `
font-family:GraphikLight;
`,
    },
    {
      Cell: `
&:nth-of-type(3) p,&:nth-of-type(4) p  {
    background-color: #d2e9fb;
    padding:0.2rem 0.5rem;
    width:fit-content;
    color:var(--styling1);
  }

  
img{
  width:2rem;
  height:2rem;
}
  padding:10px 12px;
`,
    },
  ]);
  function onSortChange(action, state) {
    console.log(action, state);
  }
  const handleClick=(prof)=>{
    setshowEdit(true);
    setselectedProfessor(professors.filter(p=>p.id === prof)[0]);
  }
  if(loading){
    return <Loader/>
  }
  return (
    <>
    <EditProffessor open={showEdit} initialValues={selectedProfessor} handleClose={()=>setshowEdit(false)} />
    <div className={classes.container}>

      <div className={classes.table}>
        <h3>View Professors</h3>
        <Table data={data} theme={theme} sort={sort}>
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCellSort sortKey="NAME">username</HeaderCellSort>
                  <HeaderCell>password</HeaderCell>
                  <HeaderCell>options</HeaderCell>
                </HeaderRow>
              </Header>

             <Body>
                
             {  
             tableList.length <1 ? <Row> <Typography padding="2rem" sx={{width:"100%",gridColumn:"1/6"}} textAlign="center">No Professors Were Found</Typography></Row>:
             tableList.map((module) => (
                  <Row key={module.name} item={module}>
                    <Cell>{module.name}</Cell>
                    <Cell>{module.password}</Cell>
                    <BasicMenu menuItems={[{title:"Delete",handleClick:()=>{}},{title:"Edit",handleClick:()=>{handleClick(module.id)}},{title:"Profile",handleClick:()=>{navigate(`/ViewProfessorProfile?id=${module.id}`)}}]} menuTitle={<MoreHoriz sx={{color:"#000"}}/>}/>
                  </Row>
                ))}
              </Body>
              
            </>
          )}
        </Table>
      </div>
    </div>
    </>
  );
};
export default ProfessorTable;