const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.get("/:id", PostsController.getPostsByUserId)
router.post("/", PostsController.createPost);
router.post("/:id/like", PostsController.likePost);
router.delete("/:id/like", PostsController.unlikePost);

router.get("/:id/comments", PostsController.getComments);
router.post("/:id/comments", PostsController.addComment);
router.delete("/:id", PostsController.deletePostById)

module.exports = router;
