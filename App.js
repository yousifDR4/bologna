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
import AddProgramModule from "./components/Profiles/DepartmentProfile/Programs/AddProgramModule.js";
import AddStudent from "./components/Profiles/CollegeProfile/AddStudent/AddStudent.jsx";
import StudentsTable from "./components/Profiles/CollegeProfile/StudentsTable/StudentsTable.jsx";
import EditStudent from "./components/Profiles/CollegeProfile/StudentsTable/EditStudent.jsx";
import Changeusername from "./components/Profiles/CollegeProfile/StudentsTable/Changeusername.jsx";
import Schedule from "./components/Profiles/DepartmentProfile/Schedule/Schedule.jsx";
import { QueryClientProvider, QueryClient } from "react-query";

let firstInitilize = true;
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
          path: "/Changeusername",
          element: <Changeusername />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  );
}

export default App;
