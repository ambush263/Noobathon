import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Postdetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Get how many posts user has opened
    let openCount = parseInt(localStorage.getItem("openCount")) || 0;
    openCount += 1;
    localStorage.setItem("openCount", openCount);

    fetch(`http://localhost:5000/posts/${id}?openCount=${openCount}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data.post);
      })
      .catch((err) => console.error(err));

  }, [id]);

  if (!post) {
    return <p style={{ padding: "1rem" }}>Loading post...</p>;
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h2>{post.pokemonName}</h2>
      <p><strong>Posted by:</strong> {post.username}</p>
      <p><strong>Type:</strong> {post.type}</p>
      <p><strong>Location:</strong> {post.location}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.pokemonName}
          style={{ maxWidth: "300px", marginTop: "1rem" }}
        />
      )}
    </div>
  );
}

export default Postdetail;