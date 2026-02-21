import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Createpost({ posts, setPosts, loggedInUser }) {
  const navigate = useNavigate();
  const [pokemonName, setPokemonName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();

  if (!loggedInUser) {
    alert("Please login first!");
    navigate("/login");
    return;
  }

  const newPost = {
    id: posts.length + 1,
    username: loggedInUser.username,
    pokemonName,
    type,
    location,
    imageUrl,
  };

  setPosts([...posts, newPost]);
  alert("Mock post created!");
  navigate("/");
};

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pokemon Name"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          required
        /><br /><br />
        <input
          type="text"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        /><br /><br />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        /><br /><br />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        /><br /><br />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default Createpost;