import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Feed from "./pages/feed";
import Createpost from "./pages/createpost";
import Login from "./pages/login";
import Register from "./pages/register";
import Navbar from "./components/navbar";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [posts, setPosts] = useState([]);

  return (
    <BrowserRouter>
      <Navbar loggedInUser={loggedInUser} />
      <Routes>
        <Route path="/" element={<Feed posts={posts} />} />
        <Route
          path="/create"
          element={<Createpost posts={posts} setPosts={setPosts} loggedInUser={loggedInUser} />}
        />
        <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;