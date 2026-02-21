import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Postdetail() {
  const { id } = useParams();  // get post ID from URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data.post);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{post.pokemonName}</h2>
      <p><strong>Posted by:</strong> {post.username}</p>
      <p><strong>Type:</strong> {post.type}</p>
      <p><strong>Location:</strong> {post.location}</p>

      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.pokemonName} style={{ maxWidth: "300px" }} />
      )}
    </div>
  );
}

export default Postdetail;