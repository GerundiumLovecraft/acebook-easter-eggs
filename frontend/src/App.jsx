import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "./App.css";

import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { FriendsPage } from "./pages/Friends/FriendsPage";
import NewPostPage from "./pages/NewPost/NewPostPage";
import ProtectedRoute from "./layouts/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

function HomeRoute() {
  const token = localStorage.getItem("token");
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp > currentTime) {
      return <Navigate to="/posts" replace />;
    } else {
      localStorage.removeItem("token");
    }
  } catch (error) {
    localStorage.removeItem("token");
  }
  return <HomePage />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "posts", element: <FeedPage /> },
      { path: "posts/new", element: <NewPostPage /> },
      { path: "users/:id", element: <ProfilePage /> },
      { path: "friends", element: <FriendsPage /> },
    ]
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
