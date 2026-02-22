import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Feed({ posts, setPosts, loggedInUser }) {
  const navigate = useNavigate();
  const [userVotes, setUserVotes] = useState({});
  const [openPostId, setOpenPostId] = useState(null);

  // Fetch posts from backend when component loads
  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          setPosts(data.posts);
          // Initialize user votes for each post
          const votes = {};
          data.posts.forEach(post => {
            let userVote = null;
            if (loggedInUser) {
              if (post.upvoters && post.upvoters.includes(loggedInUser.username)) {
                userVote = "up";
              } else if (post.downvoters && post.downvoters.includes(loggedInUser.username)) {
                userVote = "down";
              }
            }
            votes[post.id] = userVote;
          });
          setUserVotes(votes);
        }
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, [setPosts, loggedInUser]);

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

  const handleUpvote = async (e, postId) => {
    e.stopPropagation();
    
    if (!loggedInUser) {
      alert("Please login first!");
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/posts/${postId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loggedInUser.username })
      });

      if (res.ok) {
        const data = await res.json();
        setUserVotes(prev => ({
          ...prev,
          [postId]: data.voted
        }));
        
        // Update post counts
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, upvoters: data.upvoters, downvoters: data.downvoters, upvotes: data.upvoters.length, downvotes: data.downvoters.length }
            : post
        ));
      }
    } catch (err) {
      console.error("Error upvoting:", err);
    }
  };

  const handleDownvote = async (e, postId) => {
    e.stopPropagation();
    
    if (!loggedInUser) {
      alert("Please login first!");
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/posts/${postId}/downvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loggedInUser.username })
      });

      if (res.ok) {
        const data = await res.json();
        setUserVotes(prev => ({
          ...prev,
          [postId]: data.voted
        }));
        
        // Update post counts
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, upvoters: data.upvoters, downvoters: data.downvoters, upvotes: data.upvoters.length, downvotes: data.downvoters.length }
            : post
        ));
      }
    } catch (err) {
      console.error("Error downvoting:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Feed</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => {
          const upvotes = post.upvotes || 0;
          const downvotes = post.downvotes || 0;
          const userVote = userVotes[post.id];
          
          return (
            <div
              key={post.id}
              onClick={() => {
                  const opening = openPostId !== post.id;

                  setOpenPostId(opening ? post.id : null);

                  if (opening && loggedInUser) {
                    fetch(`http://localhost:5000/posts/${post.id}/view`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ username: loggedInUser.username })
                    });
                  }
                }}
                style={{
                border: "1px solid #ccc",
                margin: "1rem 0",
                padding: "0.5rem",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              <h3>{post.username}</h3>
              <p><strong>Pokemon:</strong> {post.name}</p>
              {openPostId !== post.id && (
                <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
                  <span>👍 {post.upvoters?.length || 0}</span>
                  <span>👎 {post.downvoters?.length || 0}</span>
                </div>
              )}

              {/* EXPANDED CONTENT */}
              {openPostId === post.id && (
                <>
                  <p><strong>Type:</strong> {post.type}</p>
                  <p><strong>Location:</strong> {post.location}</p>

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.name}
                      style={{ maxWidth: "200px", marginTop: "0.5rem" }}
                    />
                  )}

                  {/* Voting */}
                  <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                    <button onClick={(e) => handleUpvote(e, post.id)}>
                      👍 {post.upvoters?.length || 0}
                    </button>

                    <button onClick={(e) => handleDownvote(e, post.id)}>
                      👎 {post.downvoters?.length || 0}
                    </button>
                  </div>

                  {/* Delete */}
                  {loggedInUser?.username === post.username && (
                    <button
                      onClick={(e) => handleDelete(e, post.id)}
                      style={{ marginTop: "0.5rem", background: "red", color: "white" }}
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Feed;