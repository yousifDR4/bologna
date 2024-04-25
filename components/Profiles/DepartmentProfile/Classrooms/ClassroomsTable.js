import {useEffect, useState} from 'react';
import Options from './OptionsC';
import classes from "./ClassroomsTable.module.css"
 
import {
    Table,
    Header,
    HeaderRow,
    HeaderCell,
    Body,
    Row,
    Cell,
  } from '@table-library/react-table-library/table';
  import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { HeaderCellSort, useSort } from '@table-library/react-table-library/sort';
import Modules from '../Modules';
import { get_Sujects,get_classRooms,get_modules } from '../../../../store/getandset';
import { auth } from '../../../../store/fire';
import AddClass from './AddClass';
import { useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
const key = 'Compact Table';
// let c=[
//     {
//         name:"Programming Lab",
//         place:"Building 1",
//         notes:"",
//         id:"01"
//     }
//     ,
//     {
//         name:"Networking Lab",
//         place:"Building 1",
//         notes:"",
//         id:"02"
//     }
// ];
const ClassroomsTable = () => {
  const [classroom,setClassRoom]=useState([]);
  const [showAdd,setShowAdd]=useState(false);
  const [classS,setClassS]=useState({});
  const [edit,setEdit]=useState(false);
  const [reload,setReload]=useState(false);
  const profile = useSelector((state) => state.profile.profile);
 const Department_id= profile.Department_id;
  useEffect(()=>{

    if(!auth.currentUser)
    return;
    const f=async()=>{
      try{
     const data = await get_classRooms(Department_id)
    console.log(data);
    if (data) {
      setClassRoom(data);
    }
  }
  catch(e){

  }
   
    }
    f();
  },[auth.currentUser,reload])
  
  const data = {
    nodes:classroom
}
const addClassHandler=(edit,classroom={})=>{
if(edit){
    setClassS(classroom);
    setShowAdd(true);
    setEdit(true);
}
else{
    setClassS({});
    setShowAdd(false);
    setEdit(false);
}
}
const sort = useSort(data,{
  onChange: onSortChange,
}, {
  sortFns: {
    NAME: (array) =>
      array.sort((a, b) => a.name.localeCompare(b.name)),
  },});
  const theme = useTheme([getTheme(
   
  ),
  {Table: `
  position:unset;
  `

  },
  {
    HeaderRow: `
    font-size: 16px;
    font-family:GraphikLight;
    background-color: #F5F5F5;
    padding:0;
    
  `,
},
{HeaderCell:
  `
&:nth-of-type(3){
text-align:center;
width:100%;

}
  `
},
{Row: `
font-family:GraphikLight;
`},
{Cell: `
&:nth-of-type(3) p,&:nth-of-type(4) p  {
    background-color: #d2e9fb;
    padding:0.2rem 0.5rem;
    width:fit-content;
    color:var(--styling1);
  }
  &:nth-of-type(3){
    text-align:center;
    display:flex;
    justify-content:center;
    align-items:center;
  }
  
img{
  width:2rem;
  height:2rem;
}
  padding:10px 12px;
`},
]);
function onSortChange(action, state) {
  console.log(action, state);
}
const updateTable=()=>{
 setReload((prev)=>!prev);  
}
  return (
  <>
 {showAdd && <div className={classes.add}><AddClass classroom={classS} edit={edit} showAdd={setShowAdd} open={showAdd} setReload={setReload}/></div>}
 {showAdd && <div className={classes.backDrop} onClick={()=>setShowAdd(false)}/>}
    <div className={classes.container}>
        <div className={classes.table}>
      <Box sx={{display:"flex",flexDirection:"row",padding:"0.8rem 0"}}> <h3>View Classrooms</h3> <Button startIcon={<Add/>} onClick={()=>setShowAdd(true)} sx={{marginLeft:"0.3rem"}} variant='outlined'>Add A Classroom</Button> </Box> 
      
    <Table data={data} theme={theme} sort={sort}>
      {(tableList) => (
        <>
           <Header>
          <HeaderRow>
            <HeaderCellSort sortKey="NAME">Name</HeaderCellSort>
            <HeaderCell>Place</HeaderCell>
            <HeaderCell>Options</HeaderCell>
          </HeaderRow>
        </Header>

        <Body>
            {tableList.map((classroom) => (
              <Row key={classroom.id} item={classroom}>
                <Cell>
                  {classroom.name}
                </Cell>
                <Cell><p>{classroom.place}</p></Cell>
                <Cell><div className='relative'><Options classroom={classroom} showAdd={addClassHandler} updateTable={updateTable}/></div></Cell>
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
export default ClassroomsTable;