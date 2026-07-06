const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getPolls,
  votePoll,
} = require("../controllers/pollVoteController");

router.get(
  "/",
  authMiddleware,
  getPolls
);

router.post(
  "/:id/vote",
  authMiddleware,
  votePoll
);

module.exports = router;