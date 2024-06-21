import { Container } from "@chakra-ui/react"
import {Navigate, Route, Routes} from "react-router"
import UserPage from "./pages/UserPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
// import Basic from "./pages/Basic";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "../src/atoms/userAtom"
import LogoutButton from "./components/LogoutButton";
import UpdateProfilePage from "./pages/UpdateProfilePage";
function App() {
  const user = useRecoilValue(userAtom);
  console.log(user);
  return (
    <Container maxW="620px">
      <Header/>
      <Routes>
        <Route path="/" element={user ? <HomePage/>:<Navigate to="/auth"/> }/>
        <Route path="/auth" element={!user ? <AuthPage/>: <Navigate to="/"/> }/>
        <Route path="/:username" element={user ? <UserPage/> : <Navigate to="/auth"/>} />
        <Route path="/update" element={user ? <UpdateProfilePage/>: <Navigate to="/auth"/>} />

        <Route path="/:username/posts/" element={user ? <ProfilePage/>: <Navigate to="/auth"/>} />
        <Route path="/:user_id/:pid" element={user ? <ProfilePage/>: <Navigate to="/auth"/>} />
      </Routes>
      {
        user && <LogoutButton/>
      }
    </Container>
  )
}

export default App;
