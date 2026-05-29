const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = user => jwt.sign(
  { id: user._id.toString(), role: user.role, status: user.status },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
);

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) return res.status(401).json({ message: "Authentication token is required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("flat");

    if (!user) return res.status(401).json({ message: "User no longer exists" });
    if (user.status !== "active") return res.status(403).json({ message: "Account is not active" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};

module.exports = { signToken, requireAuth, requireAdmin, verifyToken: requireAuth, isAdmin: requireAdmin };
