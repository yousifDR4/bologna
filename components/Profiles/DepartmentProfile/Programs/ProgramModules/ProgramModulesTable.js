import {useEffect, useState} from 'react';
import classes from "./ProgramModulesTable.module.css"
 
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
import { get_Sujects,get_modules } from '../../../../../store/getandset';
import { auth } from '../../../../../store/fire';
import { useSelector } from 'react-redux';
const key = 'Compact Table';

const ProgramModulesTable = () => {
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
      ECTS: (array) =>
      array.sort((a, b) => a.ECTS - b.ECTS),
    LANGUAGE: (array) =>
      array.sort((a, b) => a.language.localeCompare(b.language)),
    LEVEL: (array) =>
      array.sort((a, b) => a.level - b.level),
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
            <HeaderCellSort sortKey="ECTS">ECTS</HeaderCellSort>
            <HeaderCellSort sortKey="LANGUAGE">Language</HeaderCellSort>
            <HeaderCellSort sortKey="LEVEL">Level</HeaderCellSort>
          </HeaderRow>
        </Header>

        <Body>
            {tableList.map((module) => (
              <Row key={module.code} item={module}>
                <Cell>{module.code}</Cell>
                <Cell>
                  {module.name}
                </Cell>
                <Cell><p>{module.ECTS}</p></Cell>
                <Cell><p>{module.language}</p></Cell>
                <Cell><p>{module.level}</p></Cell>
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
export default ProgramModulesTable;