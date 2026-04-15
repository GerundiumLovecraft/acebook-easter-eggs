const Post = require("../models/post");
const Comment = require("../models/comment");
const { generateToken } = require("../lib/token");
const mongoose = require("mongoose");
const { getIo, getUserSocketMap } = require("../socket");

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().sort({createdAt: -1}).populate('user');
    const postWithCounts = await Promise.all(
      posts.map( async (post) => {
        const commentCount = await Comment.countDocuments({postId: post._id});
        return {...post.toObject(), commentCount};
      })
    );
    const token = generateToken(req.user_id);
    res.status(200).json({posts: postWithCounts, token: token})
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(500).json({ message: "You've stumbled upon a server error" });
  }
}

async function createPost(req, res) {
  try {
    const UID = req.user_id;

    if (!req.body.message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const post = new Post({
    message: req.body.message,
    image: req.body.image ? req.body.image : "",
    user: UID,
    });

    await post.save();

    const newToken = generateToken(req.user_id);
    res.status(201).json({ message: "Post created", post: post, token: newToken });

  } catch (err) {
    console.log("Create Post Error:", err);
    res.status(500).json({ message: "Internal server error" });
  };
}

async function likePost(req, res) {
  const post = await Post.findById(req.params.id);
  if (post.likedBy.includes(req.user_id)) {
    return res.status(400).json({ message: "Already liked" });
  }
  post.likeCount = post.likeCount + 1;
  post.likedBy.push(req.user_id);
  await post.save();

  const io = getIo();
  const userSocketMap = getUserSocketMap();
  const postOwnerId = post.user.toString();
  const ownerSocketId = userSocketMap[postOwnerId];

  if (ownerSocketId && postOwnerId !== req.user_id) {
    io.to(ownerSocketId).emit("notification", {
      type: "like",
      message: "Someone liked your post!",
      postId: post._id
    });
  }

  const newToken = generateToken(req.user_id);
  res.status(200).json({ message: "Post liked", token: newToken });
}

async function unlikePost(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post.likedBy.includes(req.user_id)) {
    return res.status(400).json({ message: "Not yet liked" });
  }
  post.likeCount = post.likeCount - 1;
  post.likedBy = post.likedBy.filter((id) => id.toString() !== req.user_id);
  await post.save();

  const newToken = generateToken(req.user_id);
  res.status(200).json({ message: "Post unliked", token: newToken });
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
}

async function addComment(req, res) {
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
}

async function deletePostById(req, res) {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({message: "Invalid post ID format. Please use a valid MongoDB ObjectId"});
    }

    const postFound = await Post.findById(postId);
    
    if (!postFound) {
      return res.status(404).json({message: "Post not found"});
    }

    if (req.user_id !== postFound.user.toString()) {
      return res.status(403).json({message: "Not authorised to delete the post"})
    }

    const postDeleted = await Post.deleteOne({_id: postId});

    res.status(200).json({message: "Post successfully deleted", postDeleted});
  } catch (error) {
    console.error(error);
    res.status(400).json({message: "Something went wrong"})
  }
}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  likePost: likePost,
  unlikePost: unlikePost,
  getComments: getComments,
  addComment: addComment,
  deletePostById: deletePostById,
};

module.exports = PostsController;
