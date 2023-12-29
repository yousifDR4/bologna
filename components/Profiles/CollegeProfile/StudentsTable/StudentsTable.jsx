import { useEffect, useState } from "react";
import classes from "./StudentsTable.module.css";
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
import {
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../../store/fire";
import { useSelector } from "react-redux";
import Options from "./Options";
const key = "Compact Table";

const StudentsTable = () => {
  const profile = useSelector((state) => state.profile.profile);
  const College_id = profile.College_id;
  const [modules, setModules] = useState([]);
  useEffect(() => {
    //fetch
    setModules([]);
    console.log(profile);
    const f = async () => {
      if (!College_id) return;

      const p1 = getDocs(
        query(
          collection(db, "users"),
          and(
            where("College_id", "==", College_id),
            where("accountType", "==", "student")
          )
        )
      );
      const p2 = getDocs(
        query(
          collection(db, "passwords"),
          and(
            where("accountType", "==", "student"),
            where("College_id", "==", College_id)
          )
        )
      );
      const [d1, d2] = await Promise.all([p1, p2]);
      if(d1.empty||d2.empty)return;
      const newpbj = d1.docs.map((doc) => ({
        name: doc.data().username?doc.data().username:doc.data().email,
        id: doc.id,
        departmentName: doc.data().departmentName,
      }));
      console.log(d2.docs[0].data());
      const compose = newpbj.map((obj) => {
        const rightPassword = d2.docs
          .filter((pass) => pass.id === obj.id)[0]
          .data().password;
        console.log(obj);
        return { ...obj, password: rightPassword };
      });
      console.log(compose);
      console.log(newpbj);
      setModules(compose);
    };

    f();
  }, [profile]);
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
        NAME:(array)=>{
          console.log(array);
          console.log([...array]);
          const sortedArray = [...array].sort((a, b) => a.departmentName.localeCompare(b.departmentName));
          console.log(sortedArray);
          return sortedArray;
        }
       
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
  &:nth-of-type(5){
    text-align:center;
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
  return (
    <div className={classes.container}>
      <div className={classes.table}>
        <h3>View Student</h3>
        <Table data={data} theme={theme} sort={sort}>
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCellSort sortKey="NAME">department name</HeaderCellSort>
                   <HeaderCell>email or username</HeaderCell>
                  <HeaderCell>password</HeaderCell>
                  <HeaderCell>option</HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((module) => (
                  <Row  item={module}>
                   <Cell>{module.departmentName}</Cell>
                    <Cell>{module.name}</Cell>
                    <Cell>{module.password}</Cell>
                    <Cell><div className='relative'><Options id={module.id} code={module}/></div></Cell>
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
export default StudentsTable;
