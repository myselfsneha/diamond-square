const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getResidentDashboard,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

// Admin Dashboard
router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);

// Resident Dashboard
router.get(
  "/resident",
  authMiddleware,
  getResidentDashboard
);

module.exports = router;