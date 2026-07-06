const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getResidentDashboard,
} = require("../controllers/residentDashboardController");

// Resident dashboard
router.get(
  "/",
  authMiddleware,
  getResidentDashboard
);

module.exports = router;