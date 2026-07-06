const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getPolls,
  createPoll,
  deletePoll,
  votePoll,
} = require("../controllers/pollController");

// Get all polls (Resident + Admin)
router.get(
  "/",
  authMiddleware,
  getPolls
);

// Vote on a poll (Resident)
router.post(
  "/:id/vote",
  authMiddleware,
  votePoll
);

// Create poll (Admin)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createPoll
);

// Delete poll (Admin)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deletePoll
);

module.exports = router;