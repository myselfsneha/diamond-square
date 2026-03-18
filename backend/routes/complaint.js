const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");
const { verifyToken } = require("../middleware/auth");

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const complaint = new Complaint({
    user: req.user.id,
    message: req.body.message,
  });

  await complaint.save();
  res.json({ message: "Complaint submitted" });
});

// GET ALL (ADMIN)
router.get("/", verifyToken, async (req, res) => {
  const complaints = await Complaint.find().populate("user");
  res.json(complaints);
});

module.exports = router;