const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  message: String,
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  likeCount: { type: Number, default: 0 },
  likeBy: { type: Array, default: []},
}, { timestamps: true});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

