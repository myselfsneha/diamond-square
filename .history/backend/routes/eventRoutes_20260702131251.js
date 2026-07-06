const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getEvents,
  createEvent,
  deleteEvent,
} = require("../controllers/eventController");

// Get all events (Resident + Admin)
router.get(
  "/",
  authMiddleware,
  getEvents
);

// Create event (Admin)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createEvent
);

// Delete event (Admin)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteEvent
);

module.exports = router;