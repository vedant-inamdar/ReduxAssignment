import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInUser, registerUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import "./SignInPage.css";

const SignInPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    homeAddress: "",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    logo: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.user);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const resultAction = await dispatch(
        signInUser({
          email: formData.email,
          password: formData.password,
        })
      );
      if (signInUser.rejected.match(resultAction)) {
        setError("Invalid email or password");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError("Error signing in");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.rejected.match(resultAction)) {
        setError("Error registering user");
      } else {
        setSuccessMessage("Registration successful! Please sign in.");
        setIsRegistering(false);
      }
    } catch (err) {
      setError("Error registering user");
    }
  };

  return (
    <div className="sign-main">
      <div className="signin-container">
        <h2>{isRegistering ? "REGISTER" : "SIGN IN"}</h2>
        <form onSubmit={isRegistering ? handleRegister : handleSignIn}>
          {isRegistering && (
            <>
              {/* Registration Fields */}
              <div className="form-group horizontal">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group horizontal">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group horizontal">
                <label htmlFor="age">Age:</label>
                <input
                  type="number"
                  id="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group horizontal">
                <label htmlFor="homeAddress">Home Address:</label>
                <input
                  type="text"
                  id="homeAddress"
                  value={formData.homeAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group horizontal">
                <label htmlFor="primaryColor">Primary Color:</label>
                <input
                  type="color"
                  id="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group horizontal">
                <label htmlFor="secondaryColor">Secondary Color:</label>
                <input
                  type="color"
                  id="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group horizontal">
                <label htmlFor="logo">Logo URL:</label>
                <input
                  type="text"
                  id="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
          <div className="form-group inline">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group inline">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <button type="submit" className="register">
              {isRegistering ? "Register" : "Sign In"}
            </button>

            <button
              type="button"
              className="already"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "Already have an account? Sign In"
                : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
