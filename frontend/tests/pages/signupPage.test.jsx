import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { signup } from "../../src/services/authentication";

import { SignupPage } from "../../src/pages/Signup/SignupPage";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

// Mocking the signup service
vi.mock("../../src/services/authentication", () => {
  const signupMock = vi.fn();
  return { signup: signupMock };
});

// Reusable function for filling out signup form
async function completeSignupForm(firstName, lastName, email, password, confirmPassword) {
  const user = userEvent.setup();

  const firstNameInputEl = screen.getByLabelText("First name:")
  const lastNameInputEl = screen.getByLabelText("Last name:")
  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const passwordConfirmationEl = screen.getByLabelText("Re-enter Password:")
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(firstNameInputEl, firstName);
  await user.type(lastNameInputEl, lastName);
  await user.type(emailInputEl, email);
  await user.type(passwordInputEl, password);
  await user.type(passwordConfirmationEl, confirmPassword)
  await user.click(submitButtonEl);
}


describe("Signup Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("allows a user to signup", async () => {
    render(<SignupPage />);

    await completeSignupForm("Neil", "Breen", "test@email.com", "12345678", "12345678");

    expect(signup).toHaveBeenCalledWith("Neil", "Breen", "test@email.com", "12345678");
  });

  test("throws an error when a password does not match confirm password", async () => {
    render(<SignupPage />);

    await completeSignupForm("Neil", "Breen", "test@email.com", "12345678", "123456");

    const errorElement = await screen.findByText("Passwords do not match.");
    expect(errorElement).toBeDefined();
  })

  test("throws an error when the password is less than 8 characters", async () => {
    render(<SignupPage />);

    await completeSignupForm("Neil", "Breen", "test@email.com", "123456", "123456");

    const errorElement = await screen.findByText("Password must be at least 8 characters long.");
    expect(errorElement).toBeDefined();
  })

  test("throws an error when the email doesn't have an ending", async () => {
    render(<SignupPage />);
    await completeSignupForm("Neil", "Breen", "test@email", "12345678", "12345678");
    const errorElement1 = await screen.findByText("Please enter a valid email address.");
    expect(errorElement1).toBeDefined();
  })

  test("throws an error when the email doesn't have the @domain", async () => {
    render(<SignupPage />);
    await completeSignupForm("Neil", "Breen", "test.com", "12345678", "12345678");
    const errorElement2 = await screen.findByText("Please enter a valid email address.");
    expect(errorElement2).toBeDefined();
  })

  test("throws an error when the email only contains the first part", async () => {
    render(<SignupPage />);
    await completeSignupForm("Neil", "Breen", "test", "12345678", "12345678");
    const errorElement3 = await screen.findByText("Please enter a valid email address.");
    expect(errorElement3).toBeDefined();
  })

  test("throws an error when the email doesn't have the first part", async () => {
    render(<SignupPage />);
    await completeSignupForm("Neil", "Breen", "@test.com", "12345678", "12345678");
    const errorElement4 = await screen.findByText("Please enter a valid email address.");
    expect(errorElement4).toBeDefined();
  })

  test("navigates to /login on successful signup", async () => {
    render(<SignupPage />);

    const navigateMock = useNavigate();

    await completeSignupForm("Neil", "Breen", "test@email.com", "12345678", "12345678");

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("navigates to /signup on unsuccessful signup", async () => {
    render(<SignupPage />);

    signup.mockRejectedValue(new Error("Error signing up"));
    const navigateMock = useNavigate();

    await completeSignupForm("Neil", "Breen", "test@email.com", "12345678", "12345678");

    expect(navigateMock).toHaveBeenCalledWith("/signup");
  });
});
