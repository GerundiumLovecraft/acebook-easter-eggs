const Post = require("../models/post");
const Comment = require("../models/comment");
const { generateToken } = require("../lib/token");
const mongoose = require("mongoose");

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

async function getComments(req, res){
  try {
    const comments = await Comment.find({
      postId: req.params.id
    }).populate("userId", "profile");

    res.json({ comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function addComment(req, res){
  try {
    const comment = new Comment({
      postId: req.params.id,
      userId: req.user_id,
      content: req.body.content
    });

    await comment.save();

    res.status(201).json({ message: "Comment added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  getComments: getComments,
  addComment: addComment,
};

module.exports = PostsController;
