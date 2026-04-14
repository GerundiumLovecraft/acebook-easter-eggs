const Post = require("../models/post");
const Comment = require("../models/comment");
const { generateToken } = require("../lib/token");
const mongoose = require("mongoose");

async function getAllPosts(req, res) {
  const posts = await Post.find().populate('user');
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });
}

async function createPost(req, res) {
  const UID = req.user_id;

  const post = new Post({
    message: req.body.message,
    image: req.body.image ? req.body.image : "",
    user: UID,
  });
  post.save();

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
async function getComments(req, res) {
  try {
    const comments = await Comment.find({
      postId: req.params.id,
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
      content: req.body.content,
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
  likePost: likePost,
  getComments: getComments,
  addComment: addComment,
};
module.exports = PostsController;
