import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Feed({ posts, setPosts, loggedInUser }) {
  const navigate = useNavigate();
  const [userVotes, setUserVotes] = useState({});

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
                  
                  {/* Voting Section */}
                  <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <button
                      onClick={(e) => handleUpvote(e, post.id)}
                      style={{
                        background: userVote === "up" ? "#FFD700" : "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        opacity: userVote === "up" ? 1 : 0.6
                      }}
                      title={userVote === "up" ? "Remove upvote" : "Upvote"}
                    >
                      <img 
                        src="https://static.vecteezy.com/system/resources/thumbnails/007/737/987/small/thumbs-up-symbol-icon-illustration-free-vector.jpg" 
                        alt="upvote"
                        style={{ width: "24px", height: "24px" }}
                      />
                      <span>{upvotes}</span>
                    </button>
                    
                    <button
                      onClick={(e) => handleDownvote(e, post.id)}
                      style={{
                        background: userVote === "down" ? "#FF6B6B" : "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        opacity: userVote === "down" ? 1 : 0.6
                      }}
                      title={userVote === "down" ? "Remove downvote" : "Downvote"}
                    >
                      <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKa2ob8MqeAo9cYISUwhrfYra3-WlJmGDigQ&s" 
                        alt="downvote"
                        style={{ width: "24px", height: "24px" }}
                      />
                      <span>{downvotes}</span>
                    </button>
                  </div>
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
          );
        })
      )}
    </div>
  );
}

export default Feed;