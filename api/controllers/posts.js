const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
  const posts = await Post.find();
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });
}

async function createPost(req, res) {
  const post = new Post(req.body);
  post.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "Post created", token: newToken });
}

async function likePost(req, res) {
  const post = await Post.findById(req.params.id);

  if (post.likedBy.includes(req.user_id)) {
    return res.status(400).json({ message: "Already liked" });
  }

  post.likeCount = post.likeCount + 1;
  post.likedBy.push(req.user_id);
  await post.save();
  
  const newToken = generateToken(req.user_id);
  res.status(200).json({ message: "Post liked", token: newToken });
}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  likePost: likePost,
};


module.exports = PostsController;
