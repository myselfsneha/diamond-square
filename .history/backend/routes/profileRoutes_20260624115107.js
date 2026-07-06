const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createProfile,
  getMyProfile,
} = require("../controllers/profileController");

// Create profile
router.post(
  "/",
  authMiddleware,
  createProfile
);

// Get logged-in user's profile
router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

module.exports = router;