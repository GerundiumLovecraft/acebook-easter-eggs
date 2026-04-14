import { Link } from "react-router-dom";

import "./HomePage.css";

export function HomePage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to Acebook!</h1>
      <Link to="/signup">New to Acebook? Sign up here!</Link>
      <Link to="/login">Already part of Acebook? Log in here!</Link>
    </div>
  );
}
