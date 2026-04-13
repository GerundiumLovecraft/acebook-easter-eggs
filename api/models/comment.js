const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  content: String
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);