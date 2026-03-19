const router = require("express").Router();
const Complaint = require("../models/Complaint");
const { verifyToken } = require("../middleware/auth");
const { isAdmin } = require("../middleware/auth");

// CREATE COMPLAINT
router.post("/", verifyToken, async (req, res) => {
  try {
    await Complaint.create({
      user: req.user.id,
      message: req.body.message
    });

    res.json({ message: "Complaint submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL COMPLAINTS (ADMIN)
router.get("/", verifyToken, async (req, res) => {
  try {
    const data = await Complaint.find().populate("user");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE STATUS
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    await Complaint.findByIdAndUpdate(req.params.id, { status });

    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;