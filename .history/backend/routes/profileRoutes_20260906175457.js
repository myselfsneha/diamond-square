const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createProfile,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");

// Create profile
router.post(
  "/",
  protect,
  createProfile
);

// Get logged-in profile
router.get(
  "/",
  protect,
  getMyProfile
);

// Update logged-in profile
router.put(
  "/",
  protect,
  updateMyProfile
);

module.exports = router;