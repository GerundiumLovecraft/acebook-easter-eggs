const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification");

router.get("/", NotificationController.getNotifications);
router.put("/read", NotificationController.markAsRead);
router.get("/unread-count", NotificationController.getUnreadCount);

module.exports = router;
