const express = require("express");

const UsersController = require("../controllers/users");
const tokenChecker = require("../middleware/tokenChecker");

const router = express.Router();

router.post("/", UsersController.create);
router.get("/me", tokenChecker, UsersController.getCurrentUser);
router.get("/:id", tokenChecker, UsersController.getProfile);

module.exports = router;
