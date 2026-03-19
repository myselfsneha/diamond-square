const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/auth");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  const exists = await User.findOne({ $or: [{ email }, { phone }] });
  if (exists) return res.json({ message: "User already exists" });

  const hash = await bcrypt.hash(password, 10);

  await User.create({ name, email, phone, password: hash });

  res.json({ message: "User registered successfully" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
});

// PROFILE
router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

module.exports = router;