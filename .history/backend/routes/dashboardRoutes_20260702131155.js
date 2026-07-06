const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  getResidentDashboard,
} = require("../controllers/dashboardController");

// Admin Dashboard
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

// Resident Dashboard
router.get(
  "/resident",
  authMiddleware,
  getResidentDashboard
);

module.exports = router;