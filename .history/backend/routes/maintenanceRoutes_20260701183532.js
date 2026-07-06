const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllMaintenance,
  getMyMaintenance,
  createMaintenance,
  updateMaintenance,
  markPaid,
  deleteMaintenance,
} = require("../controllers/maintenanceController");

// ==============================
// Resident Routes
// ==============================

// View own maintenance bills
router.get(
  "/my",
  authMiddleware,
  getMyMaintenance
);

// ==============================
// Admin Routes
// ==============================

// View all maintenance bills
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllMaintenance
);

// Create maintenance bill
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createMaintenance
);

// Update maintenance bill
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateMaintenance
);

// Mark payment
router.put(
  "/pay/:id",
  authMiddleware,
  adminMiddleware,
  markPaid
);

// Delete maintenance bill
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteMaintenance
);

module.exports = router;