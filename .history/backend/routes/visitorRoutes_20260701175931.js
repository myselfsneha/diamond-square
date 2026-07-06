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

// Resident/Admin - View visitors
router.get(
  "/",
  authMiddleware,
  getVisitors
);

// Resident - Create visitor request
router.post(
  "/",
  authMiddleware,
  createVisitor
);

// Admin - Approve visitor
router.put(
  "/approve/:id",
  authMiddleware,
  adminMiddleware,
  approveVisitor
);

// Guard/Admin - Mark Entry
router.put(
  "/entry/:id",
  authMiddleware,
  markEntry
);

// Guard/Admin - Mark Exit
router.put(
  "/exit/:id",
  authMiddleware,
  markExit
);

// Admin - Delete visitor
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteVisitor
);

module.exports = router;