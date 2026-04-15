import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import socket, { connectSocket, disconnectSocket } from "../services/socket";
import { getUnreadCount } from "../services/notification";

const MainLayout = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    getUnreadCount(token).then((data) => {
      setNotificationCount(data.count);
    });

    connectSocket();

    socket.on("notification", (data) => {
      console.log("Notification received", data);
      setNotificationCount((prev) => prev + 1);
    });

    return () => {
      socket.off("notification");
      disconnectSocket();
    };
  }, []);

  return (
    <>
      <NavBar notificationCount={notificationCount} />
      <Outlet context={{ setNotificationCount }} />
    </>
  );
};

export default MainLayout;
