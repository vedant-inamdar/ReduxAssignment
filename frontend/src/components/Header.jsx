import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import "./Header.css";

const Header = ({ user, onLogoClick, onSignOut, onProfileUpdate }) => {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    onProfileUpdate(formData);
    setIsEditing(false);
  };

  return (
    <header className="header">
      <div className="logo" onClick={onLogoClick}>
        <img src={user.logo} alt="Logo" />
      </div>
      <div className="username-container">
        <div className="username">{user.firstName}</div>
        <div className="lastname">{user.lastName}</div>
      </div>
      <div className="profile-icon" onClick={toggleProfileVisibility}>
        <FaUser size={24} color="#fff" />
      </div>
      <button className="signout-button" onClick={onSignOut}>
        Sign Out
      </button>
      {isProfileVisible && (
        <div className="user-profile">
          <h2>User Profile</h2>
          {isEditing ? (
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age:</label>
                <input
                  type="number"
                  id="age"
                  value={formData.age || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="homeAddress">Home Address:</label>
                <input
                  type="text"
                  id="homeAddress"
                  value={formData.homeAddress || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="primaryColor">Primary Color:</label>
                <input
                  type="color"
                  id="primaryColor"
                  value={formData.primaryColor || "#3498db"}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="secondaryColor">Secondary Color:</label>
                <input
                  type="color"
                  id="secondaryColor"
                  value={formData.secondaryColor || "#2ecc71"}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="save">
                Save Changes
              </button>
              <button
                type="button"
                className="cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p>
                <strong>First Name:</strong> {user.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {user.lastName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Age:</strong> {user.age}
              </p>
              <p>
                <strong>Home Address:</strong> {user.homeAddress}
              </p>
              <p>
                <strong>Primary Color:</strong>{" "}
                <span style={{ color: "var(--app-primary-color)" }}>
                  {user.primaryColor}
                </span>
              </p>
              <p>
                <strong>Secondary Color:</strong>{" "}
                <span style={{ color: "var(--app-secondary-color)" }}>
                  {user.secondaryColor}
                </span>
              </p>
              <button onClick={() => setIsEditing(true)} className="edit">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
