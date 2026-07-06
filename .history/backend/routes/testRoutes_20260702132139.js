const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// Get logged-in user profile
router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user,
    });
  }
);

module.exports = router;