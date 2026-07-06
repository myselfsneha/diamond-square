const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getPolls,
  votePoll,
} = require("../controllers/pollVoteController");

// All authenticated users
router.get(
  "/",
  authMiddleware,
  getPolls
);

// Vote on poll
router.post(
  "/:id/vote",
  authMiddleware,
  votePoll
);

module.exports = router;