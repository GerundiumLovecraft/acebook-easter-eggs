const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().populate("user");
    const token = generateToken(req.user_id);
    res.status(200).json({ posts: posts, token: token });
  } catch (error) {
    console.log("Get Posts Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createPost(req, res) {
  try {
    const { message, image } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const post = new Post({ message, image, user: req.user_id });
    await post.save();

    const newToken = generateToken(req.user_id);
    res.status(201).json({ message: "Post created", post: post, token: newToken });
  } catch (error) {
    console.log("Create Post Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
};

module.exports = PostsController;