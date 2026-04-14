import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const ProtectedRoute = ({children}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace/>;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now()/1000;

    if (decoded.exp > currentTime) {
      return children;
    } else {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace/>
    }
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace/>
  }
};

export default ProtectedRoute;