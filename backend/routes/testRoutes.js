const express = require("express");
const router = express.Router();

// Import the protect middleware correctly
const { protect } = require("../middleware/authMiddleware");

// Get logged-in user profile
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
});

module.exports = router;