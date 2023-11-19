import { createBrowserRouter,RouterProvider, useLocation, useNavigate, useNavigation, useParams } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage.js';
import Root from './components/Root.js';
import Login from './components/login/Login.js';
import Error from './components/Error.js';
import UniversityProfile from './components/Profiles/UniversityProfile/UniversityProfile.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UniversityAccounts from './components/universityAccounts/UniversityAccounts.js';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getprofile } from './store/fire.jsx';
import { onLogin, selectUid, useUid } from './store/auth-slice.js';
let firstInitilize=true;
function App() {
  const profile=useSelector(state=>state.profile.profile);
  const isLoggedIn=useSelector(state=>state.auth.loggedIn);
  const dispatchRedux=useDispatch();
  useEffect(()=>{
    if(isLoggedIn){
      console.log("logged");
      if(firstInitilize){
        firstInitilize=false;
        console.log("first set");
        return;
      }
      console.log("Wewew");
      return;
    }
    else{
      console.log("notLog");
      if(firstInitilize===false){
        firstInitilize=true;
      }
    }
  },[profile])
  const router=createBrowserRouter([
   {
    path:"/",
    element:<Root/>,
    errorElement: <Error/>,
    children:[
      {
        path:"/",
        element:<MainPage/>
      },
      {
        path:"/Login",
        element:<Login/>
      },
      {
        path: "/UniversityProfile",
        element:<UniversityProfile/>
      },
        {
          path: "/Universities",
          element:<UniversityAccounts/>
        }
    ]
   }
  ]);

  return (
<RouterProvider router={router}>
  
  </RouterProvider>
  );
}

export default App;
