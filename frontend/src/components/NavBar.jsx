import { useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "./NavBar.css";

import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <input type="text" placeholder="Search..." className="navbar-search" />

      <div className="navbar-links">
        <Link to="/posts">Home</Link>
        <Link to="/posts/new">+ Create Post</Link>
        <Link to="/friends">Friends</Link>
        <Link to="/notifications">Notifications</Link>
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
            <Link to={`users/me`}>My Profile</Link>
            <LogoutButton />
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
