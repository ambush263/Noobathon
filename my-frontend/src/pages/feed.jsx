import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Feed({ posts, setPosts, loggedInUser }) {
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

  const handleDelete = async (e, postId) => {
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const res = await fetch(`http://localhost:5000/posts/${postId}`, {
          method: "DELETE"
        });

        if (res.ok) {
          setPosts(posts.filter(post => post.id !== postId));
          alert("Post deleted!");
        } else {
          alert("Failed to delete post");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting post");
      }
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Feed</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/post/${post.id}`)}
            style={{
              border: "1px solid #ccc",
              margin: "1rem 0",
              padding: "0.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              position: "relative"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div style={{ flex: 1 }}>
                <h3>Posted by: {post.username}</h3>
                <p><strong>Pokemon:</strong> {post.name}</p>
                <p><strong>Type:</strong> {post.type}</p>
                <p><strong>Location:</strong> {post.location}</p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.name}
                    style={{ maxWidth: "200px", marginTop: "0.5rem" }}
                  />
                )}
              </div>
              
              {loggedInUser && loggedInUser.username === post.username && (
                <button
                  onClick={(e) => handleDelete(e, post.id)}
                  style={{
                    background: "#ff4444",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginLeft: "1rem"
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;