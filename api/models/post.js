const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  message: { type: String },
  image: { type: String, default: ""},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likeCount: { type: Number, default: 0 },
  likedBy: { type: Array, default: [] },
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

