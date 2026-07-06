const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getNotifications,
  createNotification,
  deleteNotification,
} = require("../controllers/notificationController");

// Residents & Admins
router.get(
  "/",
  authMiddleware,
  getNotifications
);

// Admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createNotification
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteNotification
);

module.exports = router;