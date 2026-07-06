const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

// View Settings (Admin)
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getSettings
);

// Update Settings (Admin)
router.put(
  "/",
  authMiddleware,
  adminMiddleware,
  updateSettings
);

module.exports = router;