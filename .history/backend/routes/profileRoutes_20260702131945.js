const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createProfile,
  getMyProfile,
} = require("../controllers/profileController");

// Create resident profile
router.post(
  "/",
  authMiddleware,
  createProfile
);

// Get logged-in resident profile
router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

module.exports = router;