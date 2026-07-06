const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus
} = require("../controllers/complaintController");

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

module.exports = router;