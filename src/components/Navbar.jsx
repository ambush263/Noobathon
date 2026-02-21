import { Link } from "react-router-dom";

function Navbar({ loggedInUser }) {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Feed</Link> |{" "}
      {loggedInUser ? (
        <>
          <Link to="/create">Create Post</Link> | Logged in as: {loggedInUser.username}
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;