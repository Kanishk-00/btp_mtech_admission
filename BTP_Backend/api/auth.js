const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const expiresIn = "1h";

const router = express.Router();
dotenv.config();

// Dummy user data (replace with your actual user data and database interactions)
const users = [
  {
    id: 1,
    username: "exampleUser",
    password: "$2b$10$ZcZKZ.Y1j9j/M7dBqIqs7.5VJvFpFuYNQds2bCuf.ziaBL2XOEG5W", // bcrypt hash of 'password'
  },
];

const jwtSecretKey = process.env.JWT_SECRET_KEY || "your-secret-key";

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find user by username (replace with database query)
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Compare passwords using bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate and send JWT token
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    jwtSecretKey,
    { expiresIn }
  );
  res.json({ token });
});

module.exports = router;
