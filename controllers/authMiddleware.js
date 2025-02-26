// // middleware/auth.js
// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach the decoded payload to req.user
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// module.exports = verifyToken;


const jwt = require("jsonwebtoken");
const User = require("../models/Users");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
