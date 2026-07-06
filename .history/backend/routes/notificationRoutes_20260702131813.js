const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ========================================
// Admin Routes
// ========================================

// Get all notifications
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  notificationController.getNotifications
);

// Get single notification
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  notificationController.getNotificationById
);

// Create notification
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  notificationController.createNotification
);

// Update notification
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  notificationController.updateNotification
);

// Delete notification
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  notificationController.deleteNotification
);

// ========================================
// Resident Routes
// ========================================

// Get resident notifications
router.get(
  "/resident/:residentId",
  authMiddleware,
  notificationController.getResidentNotifications
);

// Mark notification as read
router.post(
  "/read/:notificationId",
  authMiddleware,
  notificationController.markAsRead
);

// Get unread notification count
router.get(
  "/unread/count",
  authMiddleware,
  notificationController.getUnreadCount
);

module.exports = router;