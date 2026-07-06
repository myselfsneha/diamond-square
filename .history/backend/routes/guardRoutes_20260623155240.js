const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getGuards,
  createGuard,
  deleteGuard,
} = require("../controllers/guardController");

// All authenticated users
router.get(
  "/",
  authMiddleware,
  getGuards
);

// Admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createGuard
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteGuard
);

module.exports = router;