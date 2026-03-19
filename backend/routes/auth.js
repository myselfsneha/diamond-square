const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  await User.create({ ...req.body, password: hash });
  res.json({ msg: "Registered" });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ phone: req.body.phone });
  const ok = await bcrypt.compare(req.body.password, user.password);

  if (!ok) return res.json({ msg: "Wrong" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token });
});

module.exports = router;