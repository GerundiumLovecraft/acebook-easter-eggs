import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/posts";
import "./NewPostPage.css";

function NewPostPage() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!message.trim()) {
        setError("Post cannot be empty");
        return;
    }

    if (image && !image.startsWith("http")) {
        setError("Please enter a valid image URL");
        return;
    }

    try {
      await createPost(message, image, token);
      navigate("/posts");
    } catch (err) {
      setError("Something went wrong, please try again");
    }
  }

  return (
    <div className="new-post-container">
      <h2>Create a Post</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default NewPostPage;