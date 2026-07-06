const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getVisitors,
  createVisitor,
  approveVisitor,
  markEntry,
  markExit,
  deleteVisitor,
} = require("../controllers/visitorController");

// Get all visitors (Authenticated)
router.get(
  "/",
  authMiddleware,
  getVisitors
);

// Create visitor request (Authenticated)
router.post(
  "/",
  authMiddleware,
  createVisitor
);

// Approve visitor (Admin)
router.put(
  "/approve/:id",
  authMiddleware,
  adminMiddleware,
  approveVisitor
);

// Mark visitor entry (Admin)
router.put(
  "/entry/:id",
  authMiddleware,
  adminMiddleware,
  markEntry
);

// Mark visitor exit (Admin)
router.put(
  "/exit/:id",
  authMiddleware,
  adminMiddleware,
  markExit
);

// Delete visitor (Admin)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteVisitor
);

module.exports = router;