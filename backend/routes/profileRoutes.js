const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticateJWT = require("../middleware/authenticateJWT");

// GET /profile
router.get("/profile", authenticateJWT, async (req, res) => {
  const email = req.user.email; // Use email from token payload
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /profile
router.put("/profile", authenticateJWT, async (req, res) => {
  const email = req.user.email; // Use email from token payload

  // Destructure and exclude email from the request body
  const { email: reqEmail, ...updateData } = req.body;

  if (reqEmail && reqEmail !== email) {
    return res.status(400).json({ message: "Email address cannot be changed" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
    });
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
