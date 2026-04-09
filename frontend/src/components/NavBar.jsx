import { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

import {
  UserCircleIcon,
  ChevronDownIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <input type="text" placeholder="Search..." className="navbar-search" />

      <div className="navbar-links">
        <Link to="/posts">Home</Link>
        <Link to="/friends">Friends</Link>
      </div>

      <div className="navbar-profile">
        <button
          className="profile-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <UserCircleIcon className="profile-icon" />
          <ChevronDownIcon className={`chevron ${menuOpen ? "rotated" : ""}`} />
        </button>

        {menuOpen && (
          <div className="dropdown-menu">
            <Link to="/profile">My Profile</Link>
            <Link to="/login" className="logout">
              <PowerIcon className="dropdown-icon" />
              Log Out
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
