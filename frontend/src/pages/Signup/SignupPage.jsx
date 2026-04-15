import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
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
  <div className="signup-page">
    <div className="signup-card">

      <div className="signup-header">
        <h2>Create an account</h2>
        <p>Enter your details below to get started</p>
        <Link to="/login" className="login-link">Already have an account?</Link>
      </div>

      {errorMessage && <p className="errorMessage">{errorMessage}</p>}

      <form className="signup-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>

        <button type="submit" className="signup-btn">
          Sign Up
        </button>

      </form>
    </div>
  </div>
  );
}
