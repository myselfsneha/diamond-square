const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getResidentDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");

// ======================================================
// Smart Dashboard Route
// Returns dashboard according to logged-in user's role
// ======================================================
router.get("/", authMiddleware, (req, res, next) => {
  if (req.user.role === "admin") {
    return getAdminDashboard(req, res, next);
  }

  return getResidentDashboard(req, res, next);
});

// ======================================================
// Admin Dashboard
// ======================================================
router.get("/admin", authMiddleware, getAdminDashboard);

// ======================================================
// Resident Dashboard
// ======================================================
router.get("/resident", authMiddleware, getResidentDashboard);

// ======================================================
// Dashboard Statistics (Optional)
// ======================================================
router.get("/stats", authMiddleware, getDashboardStats);

module.exports = router;