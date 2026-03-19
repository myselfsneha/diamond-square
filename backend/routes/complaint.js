const router = require("express").Router();
const Complaint = require("../models/Complaint");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.post("/", verifyToken, async (req, res) => {
  await Complaint.create({
    user: req.user.id,
    message: req.body.message
  });
  res.json({ msg: "Created" });
});

router.get("/", verifyToken, isAdmin, async (req, res) => {
  res.json(await Complaint.find().populate("user"));
});

router.get("/my", verifyToken, async (req, res) => {
  res.json(await Complaint.find({ user: req.user.id }));
});

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  await Complaint.findByIdAndUpdate(req.params.id, req.body);
  res.json({ msg: "Updated" });
});

module.exports = router;