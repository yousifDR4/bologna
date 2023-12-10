import {useEffect, useState} from 'react';
import classes from "./ProfessorTable.module.css"
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
const key = 'Compact Table';

const ProfessorTable = () => {
  const [modules,setModules]=useState([]);
  useEffect(()=>{
    //fetch
    setModules([{
      code:"hh3h3",
      name:"physics",
      midtermExamHours:"2",
      endtermExamHours:"3",
      id:"00", //
  },{
    code:"hh3h4",
      name:"MathII",
      midtermExamHours:"4",
      endtermExamHours:"1" ,
      id:"01"
  }]);
  },[])
  const data = {
    nodes:modules ,
}
const sort = useSort(data,{
  onChange: onSortChange,
}, {
  sortFns: {
    NAME: (array) =>
      array.sort((a, b) => a.name.localeCompare(b.name)),
    MIDTERM: (array) =>
      array.sort((a, b) => a.midtermExamHours - b.midtermExamHours),
    ENDTERM: (array) =>
      array.sort((a, b) => a.endtermExamHours - b.endtermExamHours),
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
        <h3>View Professors</h3>
    <Table data={data} theme={theme} sort={sort}>
      {(tableList) => (
        <>
           <Header>
          <HeaderRow>
            <HeaderCell >code</HeaderCell>
            <HeaderCellSort sortKey="NAME">name</HeaderCellSort>
            <HeaderCellSort sortKey="MIDTERM">midtermExamHours</HeaderCellSort>
            <HeaderCellSort sortKey="ENDTERM">endtermExamHours</HeaderCellSort>
          </HeaderRow>
        </Header>

        <Body>
            {tableList.map((module) => (
              <Row key={module.code} item={module}>
                <Cell>{module.code}</Cell>
                <Cell>
                  {module.name}
                </Cell>
                <Cell><p>{module.midtermExamHours + " hours"}</p></Cell>
                <Cell><p>{module.endtermExamHours + " hours"}</p></Cell>
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
export default ProfessorTable;