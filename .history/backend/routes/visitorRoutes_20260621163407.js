const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getVisitors,
  createVisitor,
  deleteVisitor,
} = require("../controllers/visitorController");

// Get visitors
router.get(
  "/",
  authMiddleware,
  getVisitors
);

// Add visitor
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createVisitor
);

// Delete visitor
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteVisitor
);

module.exports = router;