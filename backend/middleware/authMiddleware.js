const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No header
    if (!authHeader) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};

module.exports = authMiddleware;