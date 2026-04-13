const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  content: String
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);