const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getNotifications(token) {
  const response = await fetch(`${BACKEND_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Unable to fetch notifications");
  }

  const data = await response.json();
  return data;
}

export async function markNotificationsAsRead(token) {
  const response = await fetch(`${BACKEND_URL}/notifications/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Unable to mark notifications as read");
  }

  const data = await response.json();
  return data;
}

export async function getUnreadCount(token) {
  const response = await fetch(`${BACKEND_URL}/notifications/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Unable to fetch unread count");
  }

  const data = await response.json();
  return data;
}