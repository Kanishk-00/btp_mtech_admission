const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/dbConfig");

// Route for user login
router.post("/login", (req, res) => {
  const { username, password, branch } = req.body;

  // Query database to check if user exists
  const query = "SELECT * FROM users WHERE username = ?";
  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];
    // Compare password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!result) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Check if branch matches
      if (user.branch !== branch) {
        return res.status(401).json({ error: "Invalid branch" });
      }

      // User authenticated, generate JWT token
      const token = jwt.sign(
        {
          username: user.username,
          isAdmin: user.isAdmin, // assuming isAdmin field exists in the database
        },
        process.env.JWT_SECRET
      );

      // Store JWT token in cookie
      res.cookie("jwtToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day in milliseconds
        secure: true, // For HTTPS only, remove this in development if not using HTTPS
        sameSite: "none", // For cross-site cookies, requires secure:true
        path: "/", // Cookie path
      });

      // Send JWT token in response
      res.status(200).json({ user, message: "Login successful", token });
    });
  });
});

// Route for user signout
router.get("/signout", (req, res) => {
  // Clear the JWT token cookie
  res.clearCookie("jwtToken");

  // Send response indicating successful signout
  res.status(200).json({ message: "Signout successful" });
});

module.exports = router;
