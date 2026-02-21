
function PostCard({ name, type, location, imageUrl }) {
  return (
    <div style={{ border: "1px solid white", margin: "10px", padding: "10px" }}>
      {imageUrl && <img src={imageUrl} alt={name} style={{ width: "100px" }} />}
      <h3>{name}</h3>
      <p>Type: {type}</p>
      <p>Location: {location}</p>
    </div>
  );
}

export default PostCard;