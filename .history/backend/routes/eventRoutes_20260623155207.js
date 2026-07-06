const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getEvents,
  createEvent,
  deleteEvent,
} = require("../controllers/eventController");

// All authenticated users
router.get(
  "/",
  authMiddleware,
  getEvents
);

// Admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createEvent
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteEvent
);

module.exports = router;