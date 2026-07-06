const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getSettings
);

router.put(
  "/",
  authMiddleware,
  adminMiddleware,
  updateSettings
);

module.exports = router;