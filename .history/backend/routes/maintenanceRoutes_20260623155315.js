const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createMaintenance,
  getMyMaintenance,
  updateMaintenanceStatus,
} = require("../controllers/maintenanceController");

// Resident
router.get(
  "/",
  authMiddleware,
  getMyMaintenance
);

// Admin
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createMaintenance
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateMaintenanceStatus
);

module.exports = router;