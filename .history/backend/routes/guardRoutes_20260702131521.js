const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getGuards,
  createGuard,
  deleteGuard,
} = require("../controllers/guardController");

// Get all guards (Resident + Admin)
router.get(
  "/",
  authMiddleware,
  getGuards
);

// Create guard (Admin)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createGuard
);

// Delete guard (Admin)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteGuard
);

module.exports = router;