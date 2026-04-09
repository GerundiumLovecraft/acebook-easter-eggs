import { Link } from "react-router-dom";

import "./HomePage.css";

export function HomePage() {
  return (
    <div>
      <h1>Welcome to Acebook!</h1>
      <div className="userLinks"><Link to="/signup">New to Acebook? Sign up here!</Link>
      <Link to="/login">Already part of Acebook? Log in here!</Link>
      </div>
    </div>
  );
}
