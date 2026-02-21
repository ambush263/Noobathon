import { useNavigate } from "react-router-dom";
import PostCard from "../components/postcard";

function Feed({ posts }) {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Feed</h1>

      <button onClick={() => navigate("/create")}>
        Create Post
      </button>

      {posts.length === 0 ? (
        <p>No posts yet. Create one!</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} {...post} />)
      )}
    </div>
  );
}

export default Feed;