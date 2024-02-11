const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const jwtSecretKey = process.env.JWT_SECRET_KEY || "your-secret-key";
const tokenHeaderKey = "gfg_token_header_key"; // Adjust the header key if needed

router.get("/", (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);
    console.log("token ", token);
    const verified = jwt.verify(token, jwtSecretKey);
    console.log("if the user is verified or not: ", verified);
    if (verified) {
      return res.send("Successfully Verified");
    } else {
      // Access Denied
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
});

module.exports = router;
