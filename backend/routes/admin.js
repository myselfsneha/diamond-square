const router = require("express").Router();
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.get("/stats", verifyToken, isAdmin, async (req, res) => {
  const users = await User.countDocuments();
  const complaints = await require("../models/Complaint").countDocuments();

  res.json({
    users,
    complaints,
  });
});

module.exports = router;