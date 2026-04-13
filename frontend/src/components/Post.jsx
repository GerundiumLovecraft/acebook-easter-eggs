import "./Post.css";
import LikeButton from "./LikeButton";
import { useState, useEffect } from "react";
import { getComments, addComment } from "../services/comments";
import { jwtDecode } from "jwt-decode";

function Post({ post, token }) {
  const {
    message,
    image,
    createdAt,
    user = {}
  } = post;

const [showComments, setShowComments] = useState(false);
const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");

const token = localStorage.getItem("token");

let currentUserId = null;

if (token) {
  const decoded = jwtDecode(token);
  currentUserId = decoded.user_id || decoded.id || decoded._id;
}

useEffect(() => {
  if (!showComments) return;

  const fetchComments = async () => {
    const data = await getComments(post._id, token);
    setComments(data.comments || []);
  };

  fetchComments();
}, [showComments, post._id, token]);

const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    addComment(post._id, newComment, token).then(() => {
      getComments(post._id, token).then(data => {
        setComments(data.comments || []);
      });
      setNewComment("");
  });
};

return (
    <div className="post-card">

      {/* HEADER */}
      <div className="post-header">
        <img
          src={user.profile.profilePic || "avatar.jpg"}
          alt="profile"
          className="post-avatar"
        />

        <div>
          <p className="post-username">
            {user.profile.firstName || "Unknown User"}
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
        <LikeButton
          postId={post._id}
          likeCount={post.likeCount}
          likedBy={post.likedBy}
          token={token}
        />

        <button onClick={() => setShowComments(!showComments)}>
          💬 Comment
        </button>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="comments-section">

          {/* Existing comments */}
          {comments.map((c, i) => (
            <div key={i} className="comment">
              <strong>
                {c.userId?._id?.toString() === currentUserId?.toString()
                ? "You"
                : c.userId?.profile?.firstName
                ? `${c.userId.profile.firstName} ${c.userId.profile.lastName || ""}`
                : "User"}
              </strong>
              <span>{c.content}</span>
            </div>
          ))}

          {/* Add new comment */}
          <div className="comment-input">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button onClick={handleAddComment}>Post</button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Post;