import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/posts";
import Post from "../../components/Post";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    getPosts(token, filter)
      .then((data) => {
        setPosts(data.posts);
        localStorage.setItem("token", data.token);
      })
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate, filter]);

  const token = localStorage.getItem("token");

  return (
    <>
      <h2>Posts</h2>
      <div className="filter-control">
        <button onClick={() => setFilter("all")}>
          All posts
        </button>
        <button onClick={() => setFilter("friends")}>          
          Friends posts
        </button>
      </div>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} token={token} />
        ))}
      </div>
    </>
  );
}
