import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import SearchBar from "./SearchBar";
import "./NavBar.css";
import { House, SquarePen, Users, Bell, User, Star } from "lucide-react";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/posts" className="navbar-logo">
        <Star size={28} color="#1877f2" />
        <span className="logo-text">Acebook</span>
      </Link>

      <div className="navbar-right">
        <SearchBar />
        <div className="navbar-links">
          <Link to="/posts">
            <House size={18} /> Home
          </Link>
          <Link to="/posts/new">
            <SquarePen size={18} /> Create Post
          </Link>
          <Link to="/friends">
            <Users size={18} /> Friends
          </Link>
          <Link to="/notifications">
            <Bell size={18} /> Notifications
          </Link>
        </div>

        <div className="navbar-profile" ref={dropdownRef}>
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
      </div>
    </nav>
  );
}

export default NavBar;
