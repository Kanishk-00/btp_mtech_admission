const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/dbConfig");

router.post("/register", (req, res) => {
  const { username, password, branch } = req.body;

  // Validate branch
  const allowedBranches = ["EE", "CSE", "ME"];
  if (!allowedBranches.includes(branch)) {
    return res
      .status(400)
      .json({ error: "Invalid branch. Please select EE, CSE, or ME." });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      const newUser = { username, password: hashedPassword, branch };
      const query = "INSERT INTO users SET ?";
      connection.query(query, newUser, (error, results) => {
        if (error) {
          console.log("the error is: ", error);
          res.status(500).json({ error: "Internal server error" });
        } else {
          console.log("user");
          res.status(201).json({ message: "User created successfully" });
        }
      });
    }
  });
});

module.exports = router;
