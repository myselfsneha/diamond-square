const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getPolls,
  createPoll,
  deletePoll,
} = require("../controllers/pollController");

router.get(
  "/",
  authMiddleware,
  getPolls
);

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