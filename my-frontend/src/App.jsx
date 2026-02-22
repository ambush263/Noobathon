import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Postdetail from "./pages/postdetail";
import Help from "./pages/help";
import Feed from "./pages/feed";
import Createpost from "./pages/createpost";
import Login from "./pages/login";
import Register from "./pages/register";
import Navbar from "./components/navbar";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Load user from localStorage on app mount
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setLoggedInUser(user);
      
      // Increment refresh count
      if (user.username) {
        fetch("http://localhost:5000/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username })
        }).catch(err => console.error("Error incrementing refresh:", err));
      }
    }
  }, []);

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
  };

  return (
    <BrowserRouter>
      <Navbar loggedInUser={loggedInUser} onLogout={handleLogout} />

      <Routes>
        <Route 
          path="/" 
          element={<Feed posts={posts} setPosts={setPosts} loggedInUser={loggedInUser} />} 
        />

        <Route
          path="/create"
          element={
            <Createpost 
              posts={posts}
              setPosts={setPosts}
              loggedInUser={loggedInUser}
            />
          }
        />

        <Route 
          path="/login" 
          element={<Login setLoggedInUser={setLoggedInUser} />} 
        />

        <Route 
          path="/register" 
          element={<Register />} 
        />

        <Route 
          path="/post/:id" 
          element={<Postdetail />} 
        />

        <Route 
          path="/help" 
          element={<Help />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;