import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Createpost({ posts, setPosts, loggedInUser }) {
  const navigate = useNavigate();
  const [pokemonName, setPokemonName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedInUser) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    const newPost = {
      username: loggedInUser.username,
      name: pokemonName,
      type,
      location,
      imageUrl,
    };

    try {
      const res = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      const data = await res.json();

      if (res.ok) {
        setPosts([...posts, { ...newPost, id: data.id || posts.length + 1 }]);
        alert("Post created!");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
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