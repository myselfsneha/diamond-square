const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/authMiddleware");

// ========================================
// Admin Routes
// ========================================

// Get all notifications
router.get(
  "/",
  auth,
  notificationController.getNotifications
);

// Get single notification
router.get(
  "/:id",
  auth,
  notificationController.getNotificationById
);

// Create notification
router.post(
  "/",
  auth,
  notificationController.createNotification
);

// Update notification
router.put(
  "/:id",
  auth,
  notificationController.updateNotification
);

// Delete notification
router.delete(
  "/:id",
  auth,
  notificationController.deleteNotification
);

// ========================================
// Resident Routes
// ========================================

// Resident notification list
router.get(
  "/resident/:residentId",
  auth,
  notificationController.getResidentNotifications
);

// Mark notification as read
router.post(
  "/read/:notificationId",
  auth,
  notificationController.markAsRead
);

// Unread count
router.get(
  "/unread/count",
  auth,
  notificationController.getUnreadCount
);

module.exports = router;