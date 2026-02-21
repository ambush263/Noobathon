import { Link } from "react-router-dom";

function Navbar({ loggedInUser }) {
  return (
    <nav style={{ padding: "1rem" }}>
      <Link to="/">Feed</Link> |{" "}
      <Link to="/help">Help</Link> |{" "}
      {!loggedInUser && (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;