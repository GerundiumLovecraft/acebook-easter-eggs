import { useState } from "react";
import { likePost, unlikePost } from "../services/posts";
import { jwtDecode } from "jwt-decode";

function LikeButton({ postId, likeCount, likedBy, token }) {
  const [count, setCount] = useState(likeCount);

  let currentUserId = null
  try {
    const decoded = token ? jwtDecode(token): null;
    currentUserId = decoded ? decoded.sub: null
  } catch (e) {
    currentUserId = null;
  }
  const [liked, setLiked] = useState(likedBy && currentUserId ? likedBy.includes(currentUserId) : false);

  async function handleLike() {
    try {
      await likePost(postId, token);
      setCount(count + 1);
      setLiked(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUnlike() {
    try {
      await unlikePost(postId, token);
      setCount(count - 1);
      setLiked(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <button onClick={liked ? handleUnlike : handleLike}>
        {liked ? "❤️" : "🩶"} {count}
      </button>
    </div>
  );
}

export default LikeButton;
