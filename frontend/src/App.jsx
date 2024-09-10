import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignInPage from "./components/SignInPage";
import Home from "./components/Home";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile, clearUser } from "./redux/userSlice";
import "./App.css";
import "./SmoothEffect.css";

const App = () => {
  const user = useSelector((state) => state.user.data);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(fetchUserProfile());
      setLoading(false); // Set loading to false after fetching user data
    };
    fetchUser();
  }, [dispatch]);

  const handleLogoClick = () => {
    setShowProfile(!showProfile);
  };

  const handleSignOut = () => {
    dispatch(clearUser());
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    ); // Display loading state while determining auth status
  }

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <SignInPage />}
          />
          <Route
            path="/home"
            element={
              user ? (
                <Home
                  user={user}
                  showProfile={showProfile}
                  onLogoClick={handleLogoClick}
                  onSignOut={handleSignOut}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
