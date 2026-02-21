
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Feed from "./pages/feed";
import CreatePost from "./pages/createpost";

function App() {
  const [posts, setPosts] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Feed posts={posts} />} />
        <Route
          path="/create"
          element={<CreatePost posts={posts} setPosts={setPosts} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;