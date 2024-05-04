import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  get_Subjects,
  get_Subjects_prog_promise,
  get_active_Subjects_prog_promise,
  get_commite_exams_promise,
  get_exams_promise,
  get_prof,
  get_progs,
} from "../../../../store/getandset";
import { useSelector } from "react-redux";
import Loader from "../../../UI/Loader/Loader";
import styled from "@emotion/styled";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Delete } from "@mui/icons-material";
import AddExam from "./AddExam";
import ArticleIcon from "@mui/icons-material/Article";
import { useQuery } from "react-query";
import { ref } from "firebase/storage";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
let initcommittes = [
  {
    program: { name: "University of Baghdad", id: "JpF0GPA2vFDPRvfgmzMu" },
    establishNo: "19291",
    establishDate: "2019/2/2",
    checkEDate: "2019/2/5",
    checkENO: "190900",
    notes: "",
    semester: 1,
    examCommitte: [{ id: "83837373", name: "mohammed", level: 1 }],
    checkingCommitte: [{ id: "83837373", name: "mohammed", level: 1 }],
    id: "01",
  },
];
let initexams = [
  {
    committe: "01",
    level: "2",
    module: "5v1EYMCREB0zpB5OWRwd",
    try: "1",
    program: "JpF0GPA2vFDPRvfgmzMu",
  },
];
const Exams = () => {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reLoad, setReLoad] = useState(false);
  const [subjects, setsubjects] = useState([]);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const professorsoid = profile.professors;
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.only('xl'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isSmallScreen= useMediaQuery(theme.breakpoints.down('sm'));
  const handleChange = (event) => {
    setSelectedProgram(event.target.value);
  };
  useEffect(() => {
    const loadCommittes = async () => {
      setLoading(true);
      try {
        const p1 = get_progs(Department_id);
        const p2 = get_Subjects(Department_id);
        // Access data for each document snapshot in the array
        const [progs, sbj] = await Promise.all([p1, p2]);
        console.log(progs);
        console.log(sbj);
        setPrograms(progs ? progs : []);
        setsubjects(sbj);
     
        setLoading(false);
     
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    if (Department_id) {
      loadCommittes();
    }
  }, [reLoad, profile]);
  const promise1 = ()=>get_active_Subjects_prog_promise(
    programs.filter((p) => p.id === selectedProgram)[0].type,
    Department_id
  );
  const promise3=()=> get_exams_promise(Department_id,selectedProgram);
  const {
    data: exams=[],
    isLoading:isLoading3,
    error:iserror3,
  isFetching:isFetching3, 
   
  } = useQuery(`exams:${selectedProgram}department:${Department_id}`, promise3, {
   enabled:(!!selectedProgram),
    refetchOnWindowFocus:false,
  
    select:(data)=>{
        return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
    }
  }
  );
console.log(exams,"exam");

  const {
    data: modules,
    isLoading:isLoading1,
    error:iserror1,
    isFetching:isFetching1,
    refetch,
  } = useQuery(`program:${selectedProgram}`, promise1, {
    enabled: selectedProgram !== "",
    refetchOnWindowFocus: false,

    select: (data) => {
      return data
        ? data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        : [];
    },
  });
  const promise2=()=> get_commite_exams_promise(Department_id);

  const {
    data: committes,
    isLoading:isLoading2,
    error:iserror2,
  isFetching:isFetching2, 
   
  } = useQuery(`semester:${""}department:${Department_id}`, promise2, {
   enabled:!!Department_id,
    refetchOnWindowFocus:false,
  
    select:(data)=>{
        return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
    }
  }
  );
  const handlerefetch = () => {
    refetch();
  };

  if (loading ||isLoading1||isLoading2||isLoading3) {
    return <Loader />;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
        margin: "0.6rem 0.6rem 0rem 0.6rem",
        padding: "0 0.8rem",
      }}
    >
      <AppBar
        position="static"
        sx={{
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          bgcolor: "transparent",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ paddingLeft: "0!important",display:"flex",flexWrap:"wrap",gap:"0.8rem" }}>
          <Typography component="span" sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontFamily: "Graphik",
                color: "var(--styling1)",
                display: "inline",
                marginRight: "0.8rem",
              }}
            >
              Exams List
            </Typography>
            <AddExam
              program={programs.filter((p) => p.id === selectedProgram)[0]}
              modules= {modules? modules:[]}
              committes={committes}
              edit={false}
              subjects={subjects}
              refetch={refetch}
            />
          </Typography>
          <FormControl
            sx={{ minWidth: "12rem", width: "15%", paddingLeft: "0" }}
            size="small"
          >
            <InputLabel
              id="program"
              sx={{ color: "var(--styling1) !important" }}
            >
              Program
            </InputLabel>
            <Select

          id="program"
          label="Program"
          labelId="program"
          onChange={handleChange}
          value={selectedProgram}
           sx={{
        height: '2.5rem',
        bgcolor:"#fff",
        color: 'var(--styling1)',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--styling1) !important'
        },
        '& .MuiSvgIcon-root': {
            color: 'var(--styling1)'
        }
    }}
    variant="outlined"
        >
         {programs.map((p)=> <MenuItem value={p.id}>{p.name}</MenuItem>)}
        </Select>
        </FormControl>
          </Toolbar>
        </AppBar>
        <Box sx={{border:"none",borderTop:"none",flexGrow:"1",marginBottom:"0.4rem"}}>
        <List sx={{display:"flex",justifyContent:isSmallScreen?"center":"start",gap:"0.5rem",padding:"1rem 0"}}>
        { 
         exams.filter((exam)=> exam.program===selectedProgram).length < 1 ? <Typography variant="h6" sx={{fontFamily:"Graphik",color:"var(--styling1)",width:"100%",textAlign:"center"}}>No exams were found!</Typography>:
            exams.filter((exam)=>exam.program===selectedProgram).map((exam)=>{
                return(
     <ListItem key={exam.id} sx={{width: '19%',height:"fit-content",minWidth:"300px",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px",display:"flex",flexDirection:"column",gap:"0.5rem",bgcolor:"#fff",padding:"1rem"}}>
                <ArticleIcon sx={{width:"3rem",height:"3rem",color:"var(--styling1)",background:"var(--backGround)",borderRadius:"50%",padding:"0.5rem"}}/>
                <Accordion sx={{boxShadow:"none",border:"1px solid #d1d7dc",fontFamily:"GraphikLight",width:"95%"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          
        >
          {modules.filter((mod)=>mod.id===exam.module).length > 0 ? modules.filter((mod)=>mod.id===exam.module)[0].name :"Exam Not Found!"}
        </AccordionSummary>
        <AccordionDetails>    
     <List disablePadding sx={{  display:"flex",flexWrap:"wrap"}}>
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Level" secondary={exam.level} />
      </ListItem >
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Module" secondary={committes.filter((com)=>com.id===exam.committe)[0].establishNo}  />
      </ListItem>
      <ListItem sx={{padding:"0"}}>
        <StyledListItemText primary="Try" secondary={+exam.try === 1 ? "First Try":"Second Try" } />
      </ListItem>
    </List>  
    </AccordionDetails>
    </Accordion>
    <Box sx={{display:"flex",gap:"0.5rem",width:"100%",marginTop:"0.8rem"}}>
    <AddExam subjects={subjects} refetch={refetch} program={programs.filter((p)=>p.id===selectedProgram)[0]} modules={modules} committes={committes} edit={true} initialValues={exam}/>
          <Button startIcon={<Delete/>} sx={{'&:hover':{bgcolor:"#a2d0fb !important",border:"none"},bgcolor:"#add5fb !important",width:"50%",boxShadow:"none"}} variant="contained">Delete</Button>
        </Box>
            </ListItem>
                )
            })}

        </List>
      </Box>
    </Box>
  );
};
const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    fontFamily: "GraphikLight",
    fontSize: "0.8rem !important",
    color: "#595d61",
  },
  "& .MuiListItemText-secondary": {
    color: "var(--mainText)",
  },
}));
export default Exams;
