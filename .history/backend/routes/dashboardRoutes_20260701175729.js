const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getResidentDashboard,
} = require("../controllers/dashboardController");

const auth = require("../middleware/authMiddleware");

// Admin Dashboard
router.get("/stats", auth, getDashboardStats);

// Resident Dashboard
router.get("/resident", auth, getResidentDashboard);

module.exports = router;