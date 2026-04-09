import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import "./App.css";

import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { ProfilePage } from "./pages/Profile/ProfilePage"
import ProtectedRoute from "./layouts/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/posts" replace /> },
      { path: "posts", element: <FeedPage/> },
      { path: "/users/:id", element: <ProfilePage/> },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
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
