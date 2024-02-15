const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  // Extract token from request headers
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "Token not provided" });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    } else {
      // If token is valid, save decoded token to request object
      req.user = decoded;
      next();
    }
  });
};

module.exports = verifyToken;
