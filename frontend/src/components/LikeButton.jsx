import { useState } from "react";
import { likePost } from "../services/posts";
import { jwtDecode } from "jwt-decode";

function LikeButton({ postId, likeCount, likedBy, token }) {
  const [count, setCount] = useState(likeCount);
  const decoded = jwtDecode(token);
  const currentUserId = decoded.sub;
  const [liked, setLiked] = useState(likedBy.includes(currentUserId));

  async function handleLike() {
    try {
      await likePost(postId, token);
      setCount(count + 1);
      setLiked(true);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <button onClick={handleLike} disabled={liked}>
        {liked ? "❤️" : "🩶"} {count}
      </button>
    </div>
  );
}

export default LikeButton;
