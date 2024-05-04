import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import MainPage from "./components/MainPage/MainPage.js";
import Root from "./components/Root.js";
import Login from "./components/login/Login.js";
import Error from "./components/Error.js";
import UniversityProfile from "./components/Profiles/UniversityProfile/UniversityProfile.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UniversityAccounts from "./components/universityAccounts/UniversityAccounts.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getprofile } from "./store/fire.jsx";
import { onLogin, selectUid, useUid } from "./store/auth-slice.js";
import CollegeProfile from "./components/Profiles/CollegeProfile/CollegeProfile.js";
import DepartmentProfile from "./components/Profiles/DepartmentProfile/DepartmentProfile.js";
import AddNewModule from "./components/Profiles/DepartmentProfile/Modules_s/AddNewModule.js";
import ModulesTable from "./components/Profiles/DepartmentProfile/Modules_s/ModulesTable.js";
import EditModule from "./components/Profiles/DepartmentProfile/Modules_s/EditModule.js";
import AddProffessor from "./components/Profiles/DepartmentProfile/Proffessor/AddProffessor.js";
import ProgramManage from "./components/Profiles/DepartmentProfile/Programs/ProgramManage.js";
import ProfessorTable from "./components/Profiles/DepartmentProfile/Proffessor/PrefessorTable.js";
import ClassroomsTable from "./components/Profiles/DepartmentProfile/Classrooms/ClassroomsTable.js";
import Notifications from "./components/Notifications/Notifications.js";
import ProgramModulesTable from "./components/Profiles/DepartmentProfile/Programs/ProgramModules/ProgramModulesTable.js";
import AddProgramModule from "./components/Profiles/DepartmentProfile/Programs/add_program_module/AddProgramModule.js"

import AddStudent from "./components/Profiles/CollegeProfile/AddStudent/AddStudent.jsx";
import StudentsTable from "./components/Profiles/CollegeProfile/StudentsTable/StudentsTable.jsx";
import EditStudent from "./components/Profiles/CollegeProfile/StudentsTable/EditStudent.jsx";

import { QueryClientProvider, QueryClient } from "react-query";
import {ReactQueryDevtools } from "react-query/devtools";
import Grades from "./components/Profiles/DepartmentProfile/Exam/Grades.js";
import Exams from "./components/Profiles/DepartmentProfile/Exam/Exams.js";
import Home from "./components/Profiles/StudentProfile/Home/Home.js";
import ExamComitte from "./components/Profiles/DepartmentProfile/Exam/ExamComitte.js";
import Schedule from "./components/Profiles/DepartmentProfile/schedule/Schedule.js";
import StudentModules from "./components/Profiles/StudentProfile/Modules/StudentModules.js";
import ModulesRegisteration from "./components/Profiles/StudentProfile/ModulesRegisteration.js";
import StudentPrecense from "./components/Profiles/StudentProfile/StudentPresence.js";
import StudentProfile from "./components/Profiles/StudentProfile/StudentProfile.js";
import Assesments from "./components/Profiles/ProfessorProfile/Assesments.js";
import ProfessorModules from "./components/Profiles/ProfessorProfile/Modules/ProfessorModules.js";
import StudentsAttendance from "./components/Profiles/ProfessorProfile/StudentsAttendance.js";
import ProfessorHome from "./components/Profiles/ProfessorProfile/Home/ProfessorHome.js";
import Divsions from "./components/Profiles/DepartmentProfile/Divisions/Divsion.js";
import Library from "./components/Profiles/library/Library.js";
import StudentsModuleRegisteration from "./components/Profiles/DepartmentProfile/StudentsModuleRegisteration.js";
import ProfessorProfile from "./components/Profiles/ProfessorProfile/ProfessorProfile.js";
import ViewDepartmentProfile from "./components/Profiles/DepartmentProfile/ViewDepartmentProfile.js";



let firstInitilize=true;
function App() {
  const queryClient = new QueryClient();
 
  const profile = useSelector((state) => state.profile.profile);
  const isLoggedIn = useSelector((state) => state.auth.loggedIn);
  const dispatchRedux = useDispatch();
  useEffect(() => {
    if (isLoggedIn) {
      console.log("logged");
      if (firstInitilize) {
        firstInitilize = false;
        console.log("first set");
        return;
      }
      console.log("Wewew");
      return;
    } else {
      console.log("notLog");
      if (firstInitilize === false) {
        firstInitilize = true;
      }
    }
  }, [profile]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <MainPage />,
        },
        {
          path: "/Login",
          element: <Login />,
        },
        {
          path: "/UniversityProfile",
          element: <UniversityProfile />,
        },
        {
          path: "/Universities",
          element: <UniversityAccounts />,
        },
        {
          path: "/CollegeProfile",
          element: <CollegeProfile />,
        },
        {
          path: "/DepartmentProfile",
          element: <DepartmentProfile />,
        },
        {
          path: "/AddModule",
          element: <AddNewModule />,
        },
        {
          path: "/AddProfessor",
          element: <AddProffessor />,
        },
        {
          path: "/ModuleTable",
          element: <ModulesTable />,
        },
        {
          path: "/EditModule",
          element: <EditModule />,
        },

        {
          path: "/ProgramManage",
          element: <ProgramManage />,
        },
        {
          path: "/ProfessorList",
          element: <ProfessorTable />,
        },
        {
          path: "/Classrooms",
          element: <ClassroomsTable />,
        },
        {
          path: "/Notifications",
          element: <Notifications />,
        },
        {
          path: "/ProgramModules",
          element: <ProgramModulesTable />,
        },
        {
          path: "/AddProgramModule",
          element: <AddProgramModule />,
        },
        {
          path: "/AddStudent",

          element: <AddStudent />,
        },
        {
          path: "/StudentsTable",
          element: <StudentsTable />,
        },
        {
          path: "/EditStudent",
          element: <EditStudent />,
        },
        {
         
        },
        {
          path:"/Schedule",
        
          element:<Schedule/>
        },
        {
          path:"/ExamCommite",
          element:<ExamComitte/>
      
        },
        {
          path:"/Schedule",
         element:<Schedule/>
        },
        {
          path:"/Exams",
          element:<Exams/>
        },
        {
          path:"/Grades",
          element:<Grades/>
        },
        {
          path:"/Home",
          element:<Home/>
        },
        {
          path:"/StudentModules",
          element:<StudentModules/>
        },  {
          path:"/ModuleRegistartion",
          element:<ModulesRegisteration/>
        },
        {
          path:"/StudentPresence",
          element:<StudentPrecense/>
        },
        {
          path:"/StudentProfile",
          element:<StudentProfile/>
        },
        {
          path:"/Assesments",
          element:<Assesments/>
        },
        {
          path:"/ProfessorModules",
          element:<ProfessorModules/>
        },
        {
          path:"/ProfessorHome",
          element:<ProfessorHome/>
        },
        {
          path:"/StudentsAttendance",
          element:<StudentsAttendance/>
        },
        {
          path:"/Division",
          element:<Divsions/>
        },
        {
          path:"/Library",
          element:<Library/>
        },
        {
          path:"/StudentsModuleRegisteration",
          element:<StudentsModuleRegisteration/>
        },
        {
          path:"/ProfessorProfile",
          element:<ProfessorProfile/>
        },
        {
          path:"ViewDepartmentProfile",
          element:<ViewDepartmentProfile/>
        },



    ]
   }

  ]);

  return (
      <RouterProvider router={router}>
      </RouterProvider>
  );
}

export default App;
