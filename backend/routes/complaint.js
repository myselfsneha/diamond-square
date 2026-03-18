const router = require("express").Router();
const Complaint = require("../models/Complaint");
const { verifyToken } = require("../middleware/auth");

router.post("/", verifyToken, async (req, res) => {
  const complaint = await Complaint.create({
    user: req.user.id,
    message: req.body.message
  });

  res.json({ message: "Complaint added" });
});

router.get("/", verifyToken, async (req, res) => {
  const data = await Complaint.find().populate("user");
  res.json(data);
});

module.exports = router;