import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

function LogoutButton() {
  const navigate = useNavigate();

  function logOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <button className="logout" onClick={logOut}>
      <LogOut size={14} />
      Log Out
    </button>
  );
}

export default LogoutButton;
