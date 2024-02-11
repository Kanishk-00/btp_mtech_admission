const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const jwtSecretKey = process.env.JWT_SECRET_KEY || "your-secret-key";

router.post("/", (req, res) => {
  // Your token generation logic here
  const data = {
    userId: 1,
    username: "exampleUser",
  };

  const token = jwt.sign(data, jwtSecretKey);
  res.json({ token });
});

module.exports = router;
