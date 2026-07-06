const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getStats,
} = require("../controllers/dashboardController");

router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getStats
);

module.exports = router;