import React, { useEffect } from "react";
import Header from "./Header";
import Calculator from "./Calculator";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, clearUser } from "../redux/userSlice";

const Home = ({ showProfile, onLogoClick, onSignOut }) => {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      document.documentElement.style.setProperty(
        "--app-primary-color",
        user.primaryColor || "#3498db"
      );
      document.documentElement.style.setProperty(
        "--app-secondary-color",
        user.secondaryColor || "#2ecc71"
      );
    } else {
      // Reset to default colors when user is not logged in
      document.documentElement.style.setProperty(
        "--app-primary-color",
        "white"
      );
      document.documentElement.style.setProperty(
        "--app-secondary-color",
        "white"
      );
    }
  }, [user]);

  const handleProfileUpdate = (updatedUser) => {
    dispatch(updateUserProfile(updatedUser));
  };

  const handleSignOut = () => {
    // Reset user data in Redux store
    dispatch(clearUser());

    // Reset color variables to default
    document.documentElement.style.setProperty("--app-primary-color", "white");
    document.documentElement.style.setProperty(
      "--app-secondary-color",
      "white"
    );

    // Call external sign-out function if needed
    if (onSignOut) onSignOut();
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="home-container">
      <div className="header-container">
        <Header
          user={user}
          onLogoClick={onLogoClick}
          onSignOut={handleSignOut}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
      <div className="calculator-container">
        <Calculator />
      </div>
    </div>
  );
};

export default Home;
