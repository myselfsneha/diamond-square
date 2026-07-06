const express = require("express");
const router = express.Router();

// Import protect middleware correctly
const { protect } = require("../middleware/authMiddleware");

const {
  createProfile,
  getMyProfile,
} = require("../controllers/profileController");

// Create resident profile
router.post(
  "/",
  protect,
  createProfile
);

// Get logged-in resident profile
router.get(
  "/me",
  protect,
  getMyProfile
);

module.exports = router;