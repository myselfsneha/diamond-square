const router = require("express").Router();
const Complaint = require("../models/Complaint");
const { verifyToken, isAdmin } = require("../middleware/auth");

// CREATE
router.post("/", verifyToken, async (req, res) => {
  await Complaint.create({
    user: req.user.id,
    message: req.body.message
  });

  res.json({ message: "Complaint submitted" });
});

// GET ALL
router.get("/", verifyToken, async (req, res) => {
  const data = await Complaint.find().populate("user");
  res.json(data);
});

// MY COMPLAINTS
router.get("/my", verifyToken, async (req, res) => {
  const data = await Complaint.find({ user: req.user.id });
  res.json(data);
});

// UPDATE STATUS
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  await Complaint.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });

  res.json({ message: "Updated" });
});

module.exports = router;