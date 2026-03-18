const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/auth");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  const exists = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name, email, phone, password: hashed
  });

  res.json({ message: "Registered" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ message: "Login successful", token, user });
});

// PROFILE
router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

module.exports = router;