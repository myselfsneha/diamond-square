const router = require("express").Router();
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.get("/users", verifyToken, isAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;