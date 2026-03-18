const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getAllComplaints,
  updateStatus,
} = require("../controllers/complaintController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// USER
router.post("/", authMiddleware, createComplaint);

// ADMIN
router.get("/", authMiddleware, adminMiddleware, getAllComplaints);
router.put("/:id", authMiddleware, adminMiddleware, updateStatus);

module.exports = router;