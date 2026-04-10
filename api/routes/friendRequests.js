const express = require("express");
const router = express.Router();

const FriendRequestsControler = require("../controllers/friendRequests");

router.get("/", FriendRequestsControler.getFriendRequestsById);
router.post("/", FriendRequestsControler.sendRequest);
router.put("/:request_id", FriendRequestsControler.sendReponse);

module.exports = router;