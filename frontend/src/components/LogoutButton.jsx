import { useNavigate } from "react-router-dom";
import { PowerIcon } from "@heroicons/react/24/solid";

function LogoutButton() {
  const navigate = useNavigate();

  function logOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <button className="logout" onClick={logOut}>
      <PowerIcon className="dropdown-icon" />
      Log Out
    </button>
  );
}

export default LogoutButton;
