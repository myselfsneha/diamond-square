const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // GET TOKEN FROM HEADER
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    // FORMAT: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // SAVE USER ID IN REQUEST
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};

module.exports = authMiddleware;