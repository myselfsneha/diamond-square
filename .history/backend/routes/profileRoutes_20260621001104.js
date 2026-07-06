const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createProfile,
  getMyProfile,
} = require("../controllers/profileController");

router.post(
  "/",
  authMiddleware,
  createProfile
);

router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

module.exports = router;