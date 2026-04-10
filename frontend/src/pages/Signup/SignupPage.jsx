import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authentication";
import "./SignupPage.css"

export function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    if (!emailRegex.test(email)) {
      return setErrorMessage("Please enter a valid email address.")
    }
    
    const passwordRegex = /^.{8,}$/
    if (!passwordRegex.test(password)) {
      return setErrorMessage("Password must be at least 8 characters long.")
    }
    if (password !== confirmPassword) {
      return setErrorMessage("Passwords do not match.")
    }
    try {
      await signup(firstName, lastName, email, password);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrorMessage("Sign up failed. Please try again.")
      navigate("/signup");
    }
  }

  function handleFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event) {
    setLastName(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }

  return (
    <div>
    <h1>Welcome in!</h1>
      <h2>Signup</h2>
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
      <label htmlFor="firstName">First name: </label>
        <input className="FormField"
          id="firstName"
          type="text"
          value={firstName}
          onChange={handleFirstNameChange}
        />
        <br />
        <label htmlFor="lastName">Last name: </label>
        <input className="FormField"
          id="lastName"
          type="text"
          value={lastName}
          onChange={handleLastNameChange}
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
        <label htmlFor="confirmPassword">Re-enter Password: </label>
        <input className="FormField"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        <br />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    </div>
  );
}