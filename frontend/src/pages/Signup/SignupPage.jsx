import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../../services/authentication";

import "./SignupPage.css"

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await signup(email, password);
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/signup");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }


  // PLEASE NOTE: actual inputs for first/last name and password validation to follow in a future update. All comments will be then removed.
  return (
    <div>
    <h1>Welcome in!</h1>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
      <label htmlFor="email">First name: </label>
        <input className="FormField"
          // id="email"
          // type="text"
          // value={email}
          // onChange={handleEmailChange}
        />
        <br />
        <label htmlFor="email">Last name: </label>
        <input className="FormField"
          // id="email"
          // type="text"
          // value={email}
          // onChange={handleEmailChange}
        />
        <br />
        <label htmlFor="email">Email: </label>
        <input className="FormField"
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input className="FormField"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <br />
        <label htmlFor="password">Re-enter Password: </label>
        <input className="FormField"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <br />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    </div>
  );
}