import * as React from 'react';
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
import { useSort } from '@table-library/react-table-library/sort';
const key = 'Compact Table';

const ModulesTable = () => {
  const data = {
    nodes: [{
        code:"hh3h3",
        name:"physics",
        midtermExamHours:"2",
        endtermExamHours:"3"
    },],
}
  const theme = useTheme([getTheme(
   
  ),
  {
    HeaderRow: `
    font-size: 14px;
    font-family:GraphikLight;
    background-color: #F5F5F5;
  `,
},
{Row: `
font-family:GraphikLight;
padding:0.5rem;
`},
{Cell: `
&:nth-of-type(3),&:nth-of-type(4)  {
    background-color: #d2e9fb;
    width:fit-content;
    color:var(--styling1);
  }
`},
]);

  return (
    <div className={classes.container}>
        <div className={classes.table}>
        <h3>View modules</h3>
    <Table data={data} theme={theme} >
      {(tableList) => (
        <>
           <Header>
          <HeaderRow>
            <HeaderCell>code</HeaderCell>
            <HeaderCell>name</HeaderCell>
            <HeaderCell>midtermExamHours</HeaderCell>
            <HeaderCell>endtermExamHours</HeaderCell>
          </HeaderRow>
        </Header>

        <Body>
            {tableList.map((module) => (
              <Row key={module.code} item={module}>
                <Cell>{module.code}</Cell>
                <Cell>
                  {module.name}
                </Cell>
                <Cell>{module.midtermExamHours + " hours"}</Cell>
                <Cell>{module.endtermExamHours + " hours"}</Cell>
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