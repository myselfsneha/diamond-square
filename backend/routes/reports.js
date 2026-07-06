const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getReports,
} = require("../controllers/reportsController");

// GET /api/reports?year=2026
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getReports
);

module.exports = router;