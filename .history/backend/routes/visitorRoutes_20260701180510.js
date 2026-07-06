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

// Get all visitors
router.get(
  "/",
  authMiddleware,
  getVisitors
);

// Create visitor request
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createVisitor
);

// Approve visitor
router.put(
  "/approve/:id",
  authMiddleware,
  adminMiddleware,
  approveVisitor
);

// Mark visitor entry
router.put(
  "/entry/:id",
  authMiddleware,
  adminMiddleware,
  markEntry
);

// Mark visitor exit
router.put(
  "/exit/:id",
  authMiddleware,
  adminMiddleware,
  markExit
);

// Delete visitor
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteVisitor
);

module.exports = router;