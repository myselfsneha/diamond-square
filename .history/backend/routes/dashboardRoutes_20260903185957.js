const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getResidentDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");

// Auto dashboard (returns admin or resident dashboard based on logged-in user)
router.get("/", authMiddleware, (req, res, next) => {
  if (req.user.role === "admin") {
    return getAdminDashboard(req, res, next);
  }

  return getResidentDashboard(req, res, next);
});

// Admin dashboard
router.get("/admin", authMiddleware, getAdminDashboard);

// Resident dashboard
router.get("/resident", authMiddleware, getResidentDashboard);

// Dashboard statistics (Admin)
router.get("/stats", authMiddleware, getDashboardStats);

module.exports = router;