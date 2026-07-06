const express = require("express");
const router = express.Router();

console.log("✅ notificationRoutes loaded");

const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ==========================================
// Resident Routes
// ==========================================

// Get logged-in resident notifications
router.get(
  "/resident",
  authMiddleware,
  (req, res, next) => {
    console.log("✅ Resident route hit");
    console.log("User:", req.user);
    next();
  },
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

// ==========================================
// Admin Routes
// ==========================================

// Get all notifications
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  notificationController.getNotifications
);

// Create notification
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  notificationController.createNotification
);

// Get notification by ID
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  notificationController.getNotificationById
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

module.exports = router;