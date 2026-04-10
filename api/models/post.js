const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  message: String,
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  likeCount: { type: Number, default: 0 },
  likedBy: { type: Array, default: [] },
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

