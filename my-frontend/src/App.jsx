import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Feed from "./pages/feed";
import Createpost from "./pages/createpost";
import Login from "./pages/login";
import Register from "./pages/register";
import Navbar from "./components/navbar";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [posts, setPosts] = useState([]);

useEffect(() => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  if (savedUser) setLoggedInUser(savedUser);
}, []);

  return (
    <BrowserRouter>
      <Navbar loggedInUser={loggedInUser} />
      <Routes>
        <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Feed posts={posts} />} />
        <Route
          path="/create"
          element={<Createpost posts={posts} setPosts={setPosts} loggedInUser={loggedInUser} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;