const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getResidentDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");

router.get("/stats", authMiddleware, getDashboardStats);
router.get("/resident", authMiddleware, getResidentDashboard);
router.get("/admin", authMiddleware, getAdminDashboard);

module.exports = router;