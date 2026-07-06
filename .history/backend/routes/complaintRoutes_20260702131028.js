const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");

// Resident
router.post(
  "/",
  authMiddleware,
  createComplaint
);

router.get(
  "/my",
  authMiddleware,
  getMyComplaints
);

router.get(
  "/:id",
  authMiddleware,
  getComplaintById
);

// Admin
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllComplaints
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateComplaintStatus
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteComplaint
);

module.exports = router;