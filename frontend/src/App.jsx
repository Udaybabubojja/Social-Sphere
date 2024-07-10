import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "../src/atoms/userAtom";
// import LogoutButton from "./components/LogoutButton";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import FeedPage from "./pages/FeedPage";
import CreatePost from "./components/CreatePost";
import CreatePostPage from "./pages/CreatePostPage";
import CancelButton from "./components/CancelButton"; // import the new CancelButton component
import PostPage from "./pages/PostPage";
import UserFollowers from "./pages/UserFollowers";
import UserFollowing from "./pages/UserFollowing";

function App() {
  const user = useRecoilValue(userAtom);
  const location = useLocation();

  return (
    <Container maxW="720px">
    {user && (<Header />)}
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/:username" element={user ? <UserPage /> : <Navigate to="/auth" />} />
        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
        <Route path="/feed" element={user ? <FeedPage /> : <Navigate to="/auth" />} />
        <Route path="/:username/createpost" element={user ? <CreatePostPage /> : <Navigate to="/auth" />} />
        <Route path="/:username/:postId" element={user ? <PostPage /> : <Navigate to="/auth" />} />
        <Route path="/:username/follow" element={user ? <UserFollowers /> : <Navigate to="/auth" />} />
        <Route path="/:username/following" element={user ? <UserFollowing /> : <Navigate to="/auth" />} />
      </Routes>
      {/* {user && <LogoutButton />} */}
      {user && (location.pathname.includes("/createpost") ? <CancelButton /> : <CreatePost user={user} />)}
    </Container>
  );
}

export default App;
