const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.post("/", PostsController.createPost);
router.post("/:id/like", PostsController.likePost);

router.get("/:id/comments", PostsController.getComments);
router.post("/:id/comments", PostsController.addComment);

module.exports = router;
