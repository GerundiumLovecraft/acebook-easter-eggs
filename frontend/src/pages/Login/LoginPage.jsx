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
    <div className="login-container">
      <h1>Welcome back!</h1>
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label" htmlFor="email">Email:</label>
        <input className="login-field"
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
        <br />
        <label className="login-label" htmlFor="password">Password:</label>
        <input className="login-field"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <br />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
      <Link to="/signup">New to Acebook? Sign up here!</Link>
    </div>
  );
}
