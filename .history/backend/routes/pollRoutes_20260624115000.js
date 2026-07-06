const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getPolls,
  createPoll,
  deletePoll,
} = require("../controllers/pollController");

// All authenticated users
router.get(
  "/",
  authMiddleware,
  getPolls
);

// Admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createPoll
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deletePoll
);

module.exports = router;