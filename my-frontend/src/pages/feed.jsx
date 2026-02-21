import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Feed({ posts, setPosts }) {
  const navigate = useNavigate();

  // Fetch posts from backend when component loads
  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          setPosts(data.posts);
        }
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, [setPosts]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Feed</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/post/${post.id}`)}   // 🔥 Clickable
            style={{
              border: "1px solid #ccc",
              margin: "1rem 0",
              padding: "0.5rem",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            <h3>Posted by: {post.username}</h3>
            <p><strong>Pokemon:</strong> {post.pokemonName}</p>
            <p><strong>Type:</strong> {post.type}</p>
            <p><strong>Location:</strong> {post.location}</p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.pokemonName}
                style={{ maxWidth: "200px", marginTop: "0.5rem" }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;