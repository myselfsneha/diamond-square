const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createProfile,
  getMyProfile,
  updateMyProfile,
  deleteProfile,
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

// Delete logged-in profile
router.delete(
  "/",
  protect,
  deleteProfile
);

module.exports = router;