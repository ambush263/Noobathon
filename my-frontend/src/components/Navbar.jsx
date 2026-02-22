import { Link } from "react-router-dom";

function Navbar({ loggedInUser, onLogout }) {
  return (
    <nav style={{ padding: "1rem" }}>
      <Link to="/">Feed</Link> |{" "}
      {loggedInUser && (
        <>
          <Link to="/create">Create Post</Link> |{" "}
        </>
      )}
      <Link to="/help">Help</Link> |{" "}
      {!loggedInUser && (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </>
      )}
      {loggedInUser && (
        <>
          | {loggedInUser.username} |{" "}
          <button onClick={onLogout} style={{ cursor: "pointer", background: "none", border: "none", color: "blue", textDecoration: "underline" }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;