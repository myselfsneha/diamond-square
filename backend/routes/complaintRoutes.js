const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getComplaints,
  updateStatus,
} = require("../controllers/complaintController");

router.post("/create", createComplaint);
router.get("/", getComplaints);
router.patch("/:id", updateStatus);

module.exports = router;