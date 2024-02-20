const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/authMiddleware");

// Define the endpoint to check authentication status
router.get("/check-authentication", isAuthenticated, (req, res) => {
  // If the middleware isAuthenticated passes, it means the user is authenticated
  res.status(200).json({
    isAuthenticated: true,
    username: req.user.username,
    isAdmin: req.user.isAdmin,
  });
});

module.exports = router;
