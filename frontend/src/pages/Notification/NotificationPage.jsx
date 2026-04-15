import { useState, useEffect } from "react";
import { getNotifications, markNotificationsAsRead } from "../../services/notification";
import "./NotificationPage.css";
import { useOutletContext } from "react-router-dom";

function NotificationPage() {
  const { setNotificationCount } = useOutletContext();
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(token);
        setNotifications(data.notifications);
        await markNotificationsAsRead(token);
        setNotificationCount(0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications yet!</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification, i) => (
            <div key={i} className={`notification-item ${notification.read ? "read" : "unread"}`}>
              <img
                src={notification.sender?.profile?.profilePic || "avatar.jpg"}
                alt="profile"
                className="notification-avatar"
              />
              <div className="notification-content">
                <p>
                  <strong>
                    {notification.sender?.profile?.firstName} {notification.sender?.profile?.lastName}
                  </strong>
                  {notification.type === "like" ? " liked your post" : " commented on your post"}
                </p>
                <p className="notification-date">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationPage;