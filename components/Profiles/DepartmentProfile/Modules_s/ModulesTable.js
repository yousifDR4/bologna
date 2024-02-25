import {useEffect, useState} from 'react';
import Options from './Options';
import classes from "./ModulesTable.module.css"
 
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
import { get_Sujects,get_modules } from '../../../../store/getandset';
import { auth } from '../../../../store/fire';
import { useSelector } from 'react-redux';
const key = 'Compact Table';

const ModulesTable = () => {
  const [modules,setModules]=useState([]);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id= profile.Department_id;
  useEffect(()=>{

    if(!auth.currentUser)
    return;
    const f=async()=>{
      console.log(1111);
const data=await get_modules(Department_id)
console.log(data);
setModules(data);
    }
    f();

  },[profile])
  const data = {
    nodes:modules

}
const sort = useSort(data,{
  onChange: onSortChange,
}, {
  sortFns: {
    NAME: (array) =>
      array.sort((a, b) => a.name.localeCompare(b.name)),
    MIDTERM: (array) =>
      array.sort((a, b) => +a.midTermHours - +b.midTermHours),
    ENDTERM: (array) =>
      array.sort((a, b) => +a.endTermHours - +b.endTermHours),
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
&:nth-of-type(5){
text-align:center;
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
  &:nth-of-type(5){
    text-align:center;
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
  return (
    <div className={classes.container}>
        <div className={classes.table}>
        <h3>View modules</h3>
    <Table data={data} theme={theme} sort={sort}>
      {(tableList) => (
        <>
           <Header>
          <HeaderRow>
            <HeaderCell >code</HeaderCell>
            <HeaderCellSort sortKey="NAME">name</HeaderCellSort>
            <HeaderCellSort sortKey="MIDTERM">midtermExamHours</HeaderCellSort>
            <HeaderCellSort sortKey="ENDTERM">endtermExamHours</HeaderCellSort>
            <HeaderCell>options</HeaderCell>
          </HeaderRow>
        </Header>

        <Body>
            {tableList.map((module) => (
              <Row key={module.code + module.name + module.id} item={module}>
                <Cell>{module.code}</Cell>
                <Cell>
                  {module.name}
                </Cell>
                <Cell><p>{module.midTermHours + " hours"}</p></Cell>
                <Cell><p>{module.endTermHours + " hours"}</p></Cell>
                <Cell><div className='relative'><Options id={module.id} code={module.code}/></div></Cell>
              </Row>
            ))}
          </Body>
        </>
      )}
    </Table>
    </div>
    </div>
  );
};
export default ModulesTable;