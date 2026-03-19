const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, phone, password: hash });

  res.json({ message: "Registered" });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ phone });
  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) return res.json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
});

router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

module.exports = router;