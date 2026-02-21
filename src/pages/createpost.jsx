import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePost({ posts, setPosts }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = { id: Date.now(), name, type, location, imageUrl };

    setPosts([...posts, newPost]);

    navigate("/");
  };

  return (
    <div>
      <h1>Create a New Post</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pokemon Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <input
          type="text"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        /><br /><br />

        <input
          type="text"
          placeholder="Location Found"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        /><br /><br />

        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        /><br /><br />

        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default CreatePost;