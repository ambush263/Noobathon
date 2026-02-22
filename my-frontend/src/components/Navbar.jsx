import { Link } from "react-router-dom";

const POKEBALL_LOGO = "https://cdn.dribbble.com/userupload/32959400/file/original-dbe29920e290da99d214598ac9e2001f.png";

function Navbar({ loggedInUser, onLogout }) {
  return (
    <nav>
      {/* ── Logo ── */}
      <Link to="/" className="nav-logo">
        <img
          src={POKEBALL_LOGO}
          alt="Pokédex"
          className="pokeball-logo-img"
        />
        <span>POKÉDEX</span>
      </Link>

      {/* ── Nav links ── */}
      <Link to="/">Feed</Link>{" | "}

      {loggedInUser && (
        <>
          <Link to="/create">Create Post</Link>{" | "}
        </>
      )}

      <Link to="/help">Help</Link>{" | "}

      {!loggedInUser && (
        <>
          <Link to="/login">Login</Link>{" | "}
          <Link to="/register">Register</Link>
        </>
      )}

      {loggedInUser && (
        <>
          {loggedInUser.username}{" | "}
          <button onClick={onLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;