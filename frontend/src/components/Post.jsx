import "./Post.css";

function Post({ post }) {
  const {
    message,
    image,
    createdAt,
    user = {}
  } = post;

  return (
    <div className="post-card">

      {/* HEADER */}
      <div className="post-header">
        <img
          src={user.profilePic || "avatar.jpg"}
          alt="profile"
          className="post-avatar"
        />

        <div>
          <p className="post-username">
            {user.name || "Unknown User"}
          </p>
          <p className="post-date">
            {createdAt ? new Date(createdAt).toLocaleString() : ""}
          </p>
        </div>
      </div>

      {/* IMAGE */}
      {image && (
        <img
          src={image}
          alt="post"
          className="post-image"
        />
      )}

      {/* DESCRIPTION */}
      <p className="post-message">{message}</p>

      {/* ACTIONS */}
      <div className="post-actions">
        <button>❤️ Like</button>
        <button>💬 Comment</button>
      </div>
    </div>
  );
}

export default Post;