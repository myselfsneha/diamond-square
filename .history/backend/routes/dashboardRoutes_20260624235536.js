const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getStats,
  getDashboardData,
} = require("../controllers/dashboardController");

// Dashboard Statistics
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getStats
);

// Dashboard Overview
router.get(
  "/overview",
  authMiddleware,
  adminMiddleware,
  getDashboardData
);

module.exports = router;