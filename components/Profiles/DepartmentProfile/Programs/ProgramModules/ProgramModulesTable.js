import {useEffect, useState} from 'react';
import classes from "./ProgramModulesTable.module.css"
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
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
import { get_Sujects,get_active_modules,get_modules, get_progs } from '../../../../../store/getandset';
import { auth } from '../../../../../store/fire';
import { useSelector } from 'react-redux';
import { Box, MenuItem, Skeleton, Stack, Typography } from '@mui/material';
import { useQuery } from "react-query";
import Loader from '../../../../UI/Loader/Loader';

const key = 'Compact Table';

const ProgramModulesTable = () => {
  const [modules,setModules]=useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [programs, setPrograms] = useState([]);
  const [loading,setLoading]=useState(true);
  const [selectedProgramObject, setSelectedProgramObejct] = useState(
    programs.filter((p) => p.id === selectedProgram)[0]
  );
  const profile = useSelector((state) => state.profile.profile);
  const Department_id= profile.Department_id;
  useEffect(() => {
    setSelectedProgramObejct(
      programs.filter((p) => p.id === selectedProgram)[0]
    );
    console.log(selectedProgramObject);

  }, [selectedProgram]);
  useEffect(()=>{

    if(!auth.currentUser)
    return;
    const f=async()=>{
      console.log(1111);
const p1=get_modules(Department_id);
const p2 = get_progs(Department_id);
// Access data for each document snapshot in the array
const [mod,progs] = await Promise.all([p1, p2]);
setModules(mod);
setPrograms(progs);
setLoading(false);
    }
    f();

  },[profile])

const promise=()=> get_active_modules(Department_id,selectedProgram !== "" ?   programs.filter((p) => p.id === selectedProgram)[0].type :"",+selectedLevel);
  const {
    data: activeMod,
    isLoading,
    error,
  isFetching, 
  refetch 
  } = useQuery(`Deprartment_id:${Department_id}program:${selectedProgram !== "" ?   programs.filter((p) => p.id === selectedProgram)[0].type :""}level:${+selectedLevel}`, promise, {
   enabled:selectedProgram!=="" && selectedLevel !== "", 
    refetchOnWindowFocus:false,
  
    select:(data)=>{
      console.log(data);
        return data ? data :[]
        
    }
  }
  );
  const data = {
    nodes:activeMod ? activeMod:[]

}
const sort = useSort(data,{
  onChange: onSortChange,
}, {
  sortFns: {
    NAME: (array) =>
      array.sort((a, b) => a.name.localeCompare(b.name)),
      ECTS: (array) =>
      array.sort((a, b) => +a.ECTS - +b.ECTS),
    LANGUAGE: (array) =>
      array.sort((a, b) => a.language.localeCompare(b.language)),
    LEVEL: (array) =>
      array.sort((a, b) => +a.level - +b.level),
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
if (loading){
  return <Loader/>
}
  return (
    <div className={classes.container}>
        <div className={classes.table}>
        <h3>View modules</h3>
        <FormControl
              sx={{ minWidth: "8rem", width: "15%", marginLeft: "0.5rem",marginBottom:"0.5rem" }}
              size="small"
            >
              <InputLabel
                id="program"
               
              >
                Program
              </InputLabel>
              <Select
                id="program"
                label="Program"
                name="Program"
                labelId="program"
                onChange={(e)=>(setSelectedProgram(e.target.value))}
                value={selectedProgram}
                sx={{
                  height: "2.5rem",
                  bgcolor: "#fff",
              
                }}
                variant="outlined"
              >
                {programs.map((prog) => {
                  return (
                    <MenuItem value={prog.id} key={prog.id}>
                      {prog.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl
              sx={{ minWidth: "8rem", width: "15%", marginLeft: "0.5rem" }}
              size="small"
            >
              <InputLabel
                id="level"
              >
                Level
              </InputLabel>
              <Select
                id="level"
                name="Level"
                label="Level"
                labelId="level"
                onChange={(e)=>setSelectedLevel(e.target.value)}
                disabled={!selectedProgramObject?.type}
                value={selectedLevel}
                sx={{
                  height: "2.5rem",
                  bgcolor: "#fff",
                 
                }}
                variant="outlined"
              >
                {selectedProgramObject?.type
                  ? [...Array(selectedProgramObject["type"])].map(
                      (_, index) => (
                        <MenuItem key={index} value={index + 1}>
                          {index + 1}
                        </MenuItem>
                      )
                    )
                  : ""}
              </Select>
            </FormControl>
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
        {isLoading? <Body><Box sx={{position:"relative",height:"11rem",width:"100%",bgcolor:"#fff",gridColumn:"1/6"}}> <TableLoader/></Box></Body>: tableList.length  < 1 ? <Typography color="text.secondary" textAlign="center" marginTop="1.5rem" marginBottom="0.8rem"width="100%" sx={{gridColumn:"1/6"}}>No modules were found!</Typography>:
        <Body>
          {tableList.map((module) => (
              <Row key={module.id} item={module}>
                <Cell>{module.code}</Cell>
                <Cell>
                  {modules.filter((mod)=>mod.id === module.module).length >0 ? modules.filter((mod)=>mod.id === module.module)[0].name :"" }
                </Cell>
                <Cell>{module.ECTS}</Cell>
                <Cell>   {modules.filter((mod)=>mod.id === module.module).length >0 ? modules.filter((mod)=>mod.id === module.module)[0].language :"" }</Cell>
                <Cell>{module.level}</Cell>
              </Row>
            ))}
          </Body>}
        </>
      )}
    </Table>
    </div>
    </div>
  );
};
export default ProgramModulesTable;

const TableLoader=()=>{
  return(
    <Stack spacing={1} marginTop="0.8rem" sx={{height:"10rem",width:"100%"}}>
      
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />
      <Skeleton variant="rectangular"  animation="wave" sx={{height:"20%"}} />

    </Stack>
  )
}