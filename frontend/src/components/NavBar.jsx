import { useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "./NavBar.css";

import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { Home, PenSquare, Users, Bell, User } from "lucide-react";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <input type="text" placeholder="Search..." className="navbar-search" />

      <div className="navbar-links">
        <Link to="/posts">
          <Home size={18} /> Home 
        </Link>
        <Link to="/posts/new">
          <PenSquare size={18} /> Create Post
        </Link>
        <Link to="/friends">
          <Users size={18} /> Friends
        </Link>
        <Link to="/notifications">
          <Bell size={18} /> Notifications
        </Link>
      </div>

      <div className="navbar-profile">
        <button
          className="profile-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <User size={24} />
        </button>

        {menuOpen && (
          <div className="dropdown-menu">
            <Link to={`users/me`}>
              <User size={14} /> My Profile
            </Link>
            <LogoutButton />
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
