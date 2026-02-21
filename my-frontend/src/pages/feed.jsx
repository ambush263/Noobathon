import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Feed({ posts, setPosts }) {
  const navigate = useNavigate();

  // Fetch posts from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          setPosts(data.posts); // ✅ properly update state
        }
      })
      .catch((err) => console.error(err));
  }, [setPosts]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Feed</h1>

      {/* 🔥 Create Post Button */}
      <button
        onClick={() => navigate("/create")}
        style={{ marginBottom: "1rem" }}
      >
        Create Post
      </button>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              margin: "1rem 0",
              padding: "0.5rem",
              borderRadius: "8px"
            }}
          >
            <h3>{post.username}</h3>
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