import { useEffect } from "react";

function Feed({ posts }) {
  // Fetch posts from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          posts.splice(0, posts.length, ...data.posts); // update the posts array
        }
      })
      .catch((err) => console.error(err));
  }, [posts]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Feed</h1>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{ border: "1px solid #ccc", margin: "1rem 0", padding: "0.5rem" }}
          >
            <h3>{post.username}</h3>
            <p>Pokemon: {post.pokemonName}</p>
            <p>Type: {post.type}</p>
            <p>Location: {post.location}</p>
            {post.imageUrl && <img src={post.imageUrl} alt={post.pokemonName} style={{ maxWidth: "200px" }} />}
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;