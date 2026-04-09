import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../services/authentication";

import "./LoginPage.css"

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <>
      <h1>Welcome back!</h1>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input className="FormField"
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input className="FormField"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <br />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    </>
  );
}
