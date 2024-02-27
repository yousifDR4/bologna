import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { auth } from "../../../../store/fire";
import {
    get_Schedule_promise,
  get_Subjects,
  get_classRooms,
  get_progs,
} from "../../../../store/getandset";
import Loader from "../../../UI/Loader/Loader";
import AddScheduling from "./AddScheduling";
import { useSelector } from "react-redux";
import { Fullscreen } from "@mui/icons-material";
import ScheduleTable from "./ScheduleTable";
import { useQuery } from "react-query";

const Schedule = () => {
  const [programs, setPrograms] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [modules, setModules] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStudy, setSelectedStudy] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [loading, setLoading] = useState(true);
  const [refitch, setRefitch] = useState(false);
  const [selectedProgramObject, setSelectedProgramObejct] = useState(
    programs.filter((p) => p.id === selectedProgram)[0]
  );
  const profile = useSelector((state) => state.profile.profile);
  const Department_id = profile.Department_id;
  const functionMap = {
    //store functions refrences
    setSelectedDivision,
    setSelectedLevel,
    setSelectedProgram,
    setSelectedSpeciality,
    setSelectedStudy,
  };
  useEffect(() => {
    console.log("NNNN");
    if (!auth.currentUser) return;
    const f = async () => {
      try {
        const p1 = get_Subjects(Department_id);
        const p3 = get_classRooms(Department_id);
        const p4 = get_progs(Department_id);
        // Access data for each document snapshot in the array
        const [Sujects, classRooms, progs] = await Promise.all([p1, p3, p4]);
        setModules(Sujects);
        console.log(Sujects);
        console.log(progs);
        //division fetch
        setClassrooms(classRooms);
        console.log(classRooms);
        setPrograms(progs);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    if (Department_id) {
      f();
    }
  }, [refitch, profile, Department_id]);
  const promise=()=> get_Schedule_promise(selectedProgram,selectedLevel);
  const {
    data: modulesSch,
    isLoading,
    error,
  isFetching, 
  refetch 
  } = useQuery(`program:${selectedProgram}levels:${selectedLevel}`, promise, {
   enabled:selectedProgram!=="", 
    refetchOnWindowFocus:false,
  
    select:(data)=>{
        return data ? data.docs.map((doc)=>({...doc.data(),id:doc.id})) :[]
        
    }
  }
  );
  const handlerefetch=()=>{
    refetch();
  }
  console.log(modulesSch,"mod");
  useEffect(() => {
    setSelectedProgramObejct(
      programs.filter((p) => p.id === selectedProgram)[0]
    );
  }, [selectedProgram]);
  const handleChange = (event) => {
    console.log(event);
    let funcName = "setSelected" + event.target.name;
    console.log(funcName);
    functionMap[funcName](event.target.value);
  };
  if (isLoading||!Department_id ||loading) {
    return <Loader />;
  }
  let disableButton =
    selectedDivision !== "" &&
    selectedLevel !== "" &&
    selectedProgram !== "" &&
    selectedSpeciality !== "";

  return (
    <Box
      sx={{ width: "100%", padding: "1.4rem 1rem", boxSizing: "border-box" }}
    >
      <AppBar
        position="static"
        sx={{ bgcolor: "transparent", boxShadow: "none", width: "100%" }}
      >
        <Toolbar
          sx={{
            paddingLeft: "0!important",
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8rem",
          }}
        >
          <Typography component="span" sx={{ width: "100%", display: "flex" }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontFamily: "Graphik",
                color: "var(--styling1)",
                display: "inline",
                marginRight: "0.8rem",
                flex: "1",
              }}
            >
              Schedule
            </Typography>
            <AddScheduling
              edit={false}
              modules={modules}
              classes={classrooms}
              study={selectedStudy}
              disabled={disableButton}
              selectedDivision={selectedDivision}
              selectedLevel={selectedLevel}
              selectedProgram={selectedProgram}
              selectedSpeciality={selectedSpeciality}
              handlerefetch={handlerefetch}
            />
          </Typography>
          <Typography
            component="span"
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <FormControl
              sx={{ minWidth: "8rem", width: "15%", paddingLeft: "0" }}
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
                name="Program"
                labelId="program"
                onChange={handleChange}
                value={selectedProgram}
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
              sx={{ minWidth: "8rem", width: "15%", paddingLeft: "0" }}
              size="small"
            >
              <InputLabel
                id="level"
                sx={{ color: "var(--styling1) !important" }}
              >
                Level
              </InputLabel>
              <Select
                id="level"
                name="Level"
                label="Level"
                labelId="level"
                onChange={handleChange}
                disabled={!selectedProgramObject?.type}
                value={selectedLevel}
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
            <FormControl
              sx={{ minWidth: "8rem", width: "15%", paddingLeft: "0" }}
              size="small"
            >
              <InputLabel
                id="speciality"
                sx={{ color: "var(--styling1) !important" }}
              >
                Speciality
              </InputLabel>
              <Select
                id="speciality"
                label="Speciality"
                name="Speciality"
                labelId="speciality"
                onChange={handleChange}
                value={selectedSpeciality}
                disabled={
                  !selectedProgramObject?.speciality ||
                  selectedProgramObject?.speciality < selectedLevel
                }
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
                {specialities.map((sp) => {
                  return <MenuItem value={sp.id}>{sp.name}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <FormControl
              sx={{ minWidth: "8rem", width: "15%", paddingLeft: "0" }}
              size="small"
            >
              <InputLabel
                id="study"
                sx={{ color: "var(--styling1) !important" }}
              >
                Study Type
              </InputLabel>
              <Select
                id="study"
                label="Study"
                name="Study"
                labelId="study"
                onChange={handleChange}
                value={selectedSpeciality}
                disabled={!selectedProgramObject?.eveningStudy}
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
                <MenuItem value="morning">Morning Study</MenuItem>
                <MenuItem value="evening">Evening Study</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{ minWidth: "8rem", width: "15%", paddingLeft: "0" }}
              size="small"
            >
              <InputLabel
                id="division"
                sx={{ color: "var(--styling1) !important" }}
              >
                Division
              </InputLabel>
              <Select
                id="division"
                label="Division"
                name="Division"
                labelId="division"
                onChange={handleChange}
                value={selectedDivision}
                disabled={selectedStudy.length < 1}
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
                {divisions.map((d) => {
                  return <MenuItem value={d.id}>{d.name}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          overflow: "auto",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
      
          <ScheduleTable
          modules={modulesSch ? modulesSch :[]}
          timeStart="8:30"
          timeEnd="14:30"
          classRooms={classrooms}
          modulesList={modules}
        />
        
      
      </Box>
    </Box>
  );
};
export default Schedule;
