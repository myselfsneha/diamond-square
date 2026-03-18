const express = require("express");
const router = express.Router();

const {
  createMaintenance,
  getMyMaintenance,
  markPaid,
} = require("../controllers/maintenanceController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ADMIN
router.post("/", authMiddleware, adminMiddleware, createMaintenance);

// USER
router.get("/", authMiddleware, getMyMaintenance);
router.put("/:id", authMiddleware, markPaid);

module.exports = router;