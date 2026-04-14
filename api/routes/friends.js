const express = require("express");
const router = express.Router();

const FriendsController = require("../controllers/friends");

router.get("/", FriendsController.getFriendList);

module.exports = router;