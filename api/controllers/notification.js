const Notification = require("../models/notification");
const { generateToken } = require("../lib/token");

async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ recipient: req.user_id })
      .populate("sender", "profile")
      .populate("post", "message")
      .sort({ createdAt: -1 });

    const newToken = generateToken(req.user_id);
    res.status(200).json({ notifications, token: newToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function markAsRead(req, res) {
  try {
    await Notification.updateMany(
      { recipient: req.user_id, read: false },
      { read: true }
    );

    const newToken = generateToken(req.user_id);
    res.status(200).json({ message: "Notifications marked as read", token: newToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const NotificationController = {
  getNotifications,
  markAsRead,
};

module.exports = NotificationController;