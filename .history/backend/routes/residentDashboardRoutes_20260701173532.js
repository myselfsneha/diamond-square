const express = require("express");
const router = express.Router();

const {
  getResidentDashboard,
} = require("../controllers/residentDashboardController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getResidentDashboard);

module.exports = router;