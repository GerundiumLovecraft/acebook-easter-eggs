import "./Post.css";
import LikeButton from "./LikeButton";
import { useState, useEffect } from "react";
import { getComments, addComment } from "../services/comments";
import { jwtDecode } from "jwt-decode";
import { MessageCircle } from "lucide-react"
import { Link } from "react-router-dom";

function Post({ post, token }) {
  const { message, image, createdAt, user = {} } = post;

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  let currentUserId = null;

  if (token) {
    const decoded = jwtDecode(token);
    currentUserId = decoded.sub
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
      getComments(post._id, token).then((data) => {
        setComments(data.comments || []);
      });
      setNewComment("");
    });
  };

  return (
    <div className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <Link to={`/users/${user ? user._id.toString() === currentUserId.toString() ? "me" : user._id.toString() : "me"}`}>
          <img
            src={user.profile?.profilePic || "avatar.jpg"}
            alt="profile"
            className="post-avatar"
          />
        </Link>
        <div>
          <Link to={`/users/${user ? user._id.toString() === currentUserId.toString() ? "me" : user._id.toString() : "me"}`}>
            <p className="post-username">
              {user.profile?.firstName
                  ? `${user.profile.firstName} ${user.profile.lastName || ""}`.trim()
                  : "Unknown User"}
            </p>
          </Link>
          <p className="post-date">
            {createdAt ? new Date(createdAt).toLocaleString() : ""}
          </p>
        </div>
      </div>

      {/* IMAGE */}
      {image && <img src={image} alt="post" className="post-image" />}

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
          <MessageCircle size={18} color="#666" />
          Comment ({showComments ? comments.length : post.commentCount})
        </button>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="comments-section">
          {/* Existing comments */}
          {comments.map((c, i) => (
            <div key={i} className="comment">
              <Link to={`/users/${c.userId ? c.userId._id.toString() === currentUserId.toString() ? "me" : c.userId._id : "me"}`}>
                <strong>
                  {c.userId?._id?.toString() === currentUserId?.toString()
                    ? "You"
                    : c.userId?.profile?.firstName
                      ? `${c.userId.profile.firstName} ${c.userId.profile.lastName || ""}`
                      : "User"}
                </strong>
              </Link>
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
