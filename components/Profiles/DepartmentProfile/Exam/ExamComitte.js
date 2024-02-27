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
import { get_commite_promise, get_prof, get_progs } from "../../../../store/getandset";
import { setLogLevel } from "firebase/app";
import { useSelector } from "react-redux";
import Loader from "../../../UI/Loader/Loader";
import styled from "@emotion/styled";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCommitte from "./AddCommite";
import { Delete } from "@mui/icons-material";
import CommitteMembers from "./CommitteMembers";
import { useQuery } from "react-query";
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
  },
];
const ExamComitte = () => {
  const [selectedSemester, setSelectedSemester] = useState(1);

  const [programs, setPrograms] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reLoad, setReLoad] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const professorsoid = profile.professors;
  const handleChange = (event) => {
    setSelectedSemester(event.target.value);
  };
  useEffect(() => {
    const loadCommittes = async () => {
      setLoading(true);
      try {
        const p1 = get_progs(Department_id);
        const p2 = get_prof(professorsoid);
        // Access data for each document snapshot in the array
        const [progs, profs] = await Promise.all([p1, p2]);
        console.log(progs);
        setPrograms(progs ? progs : []);
        setProfessors(profs ? profs : []);
    
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
  const promise=()=> get_commite_promise(selectedSemester,Department_id);
  console.log(selectedSemester,Department_id);
  const {
    data: committes,
    isLoading,
    error,
  isFetching, 
  refetch 
  } = useQuery(`semester:${selectedSemester}department:${Department_id}`, promise, {
   enabled:!!Department_id,
    refetchOnWindowFocus:false,
  
    select:(data)=>{
        return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
    }
  }
  );
  console.log(committes ,"comm");
  const handlerefetch=()=>{
    refetch();
  }
  if (loading|| isLoading ) {
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
        <Toolbar sx={{ paddingLeft: "0!important" }}>
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
              Exam Comittes List
            </Typography>
            <AddCommitte programs={programs} semester={selectedSemester} />
          </Typography>
          <FormControl
            sx={{ minWidth: "8rem", width: "15%", paddingLeft: "0" }}
            size="small"
          >
            <InputLabel
              id="semester"
              sx={{ color: "var(--styling1) !important" }}
            >
              Semester
            </InputLabel>
            <Select
              id="semester"
              label="Semester"
              labelId="semester"
              onChange={handleChange}
              value={selectedSemester}
              sx={{
                height: "2.5rem",
                bgcolor: "#fff",
                color: "var(--styling1)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--styling1) !important",
                },
                "& .MuiSvgIcon-root": {
                  color: "var(--styling1)",
                },
              }}
              variant="outlined"
            >
              <MenuItem value={1}>First Semester</MenuItem>
              <MenuItem value={2}>Second Semester</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          border: "none",
          borderTop: "none",
          flexGrow: "1",
          marginBottom: "0.4rem",
        }}
      >
        <List sx={{ display: "flex", gap: "0.5rem", padding: "1rem 0" }}>
          {committes.filter(
            (committe) => committe.semester === selectedSemester
          ).length < 1 ? (
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Graphik",
                color: "var(--styling1)",
                width: "100%",
                textAlign: "center",
              }}
            >
              No Committees were found!
            </Typography>
          ) : (
            committes
              .filter((committe) => committe.semester === selectedSemester)
              .map((committe) => {
                return (
                  <ListItem
                    key={committe.id}
                    sx={{
                      width: "19%",
                      minWidth: "250px",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      bgcolor: "#fff",
                    }}
                  >
                    <GroupRoundedIcon
                      sx={{
                        width: "3rem",
                        height: "3rem",
                        color: "var(--styling1)",
                        background: "var(--backGround)",
                        borderRadius: "50%",
                        padding: "0.5rem",
                      }}
                    />
                    <Accordion
                      sx={{
                        boxShadow: "none",
                        border: "1px solid #d1d7dc",
                        fontFamily: "GraphikLight",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        {committe.program.toLocaleUpperCase()}
                      </AccordionSummary>
                      <AccordionDetails>
                        <List sx={{ display: "flex", flexWrap: "wrap" }}>
                          <ListItem sx={{ padding: "0" }}>
                            <StyledListItemText
                              primary="Committe Establishemnet Order Number"
                              secondary={committe.establishNo}
                            />
                          </ListItem>
                          <ListItem sx={{ padding: "0" }}>
                            <StyledListItemText
                              primary="Committe Establishment Order Date"
                              secondary={committe.establishDate}
                            />
                          </ListItem>
                          <ListItem sx={{ padding: "0" }}>
                            <StyledListItemText
                              primary="Checking Commite Establishment Order No."
                              secondary={committe.checkENO}
                            />
                          </ListItem>
                          <ListItem sx={{ padding: "0" }}>
                            <StyledListItemText
                              primary="Checking Committe Establishment Order Date"
                              secondary={committe.checkEDate}
                            />
                          </ListItem>
                          <ListItem sx={{ padding: "0" }}>
                            <StyledListItemText
                              primary="Notes"
                              secondary={
                                committe.notes.length > 0
                                  ? committe.notes
                                  : "None"
                              }
                            />
                          </ListItem>
                        </List>
                      </AccordionDetails>
                    </Accordion>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "0.5rem",
                        width: "100%",
                        marginTop: "0.8rem",
                      }}
                    >
                      <AddCommitte
                        programs={programs}
                        initialValues={committe}
                        edit={true}
                      />
                      <Button
                        startIcon={<Delete />}
                        sx={{
                          "&:hover": {
                            bgcolor: "#a2d0fb !important",
                            border: "none",
                          },
                          bgcolor: "#add5fb !important",
                          width: "50%",
                          boxShadow: "none",
                        }}
                        variant="contained"
                      >
                        Delete
                      </Button>
                    </Box>
                    <CommitteMembers
                      edit={true}
                      initialValues={committe}
                      professors={professors}
                      program={
                        programs.filter(
                          (prog) => prog.id === committe["program"]["id"]
                        )[0]
                      }
                    />
                  </ListItem>
                );
              })
          )}
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
export default ExamComitte;
