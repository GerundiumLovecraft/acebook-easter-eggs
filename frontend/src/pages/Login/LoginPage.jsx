import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { login } from "../../services/authentication";

import "./LoginPage.css"

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      setErrorMessage("Invalid email or password.");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        
        <div className="login-header">
          <h2>Login to your account</h2>
          <p>Enter your email below to login to your account</p>
          <Link to="/signup" className="signup-link">Sign Up</Link>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="m@example.com"
              required
            />
          </div>

          <div className="form-group">
            <div className="password-row">
              <label>Password</label>
            </div>
            <input
              type="password"
              value={password}
              placeholder="* * * * * * * *"
              onChange={handlePasswordChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}
