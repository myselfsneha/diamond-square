const Complaint = require("../models/Complaint");

// ================= CREATE COMPLAINT =================
exports.createComplaint = async (req, res) => {
  try {
    const { title, message } = req.body;

    const complaint = new Complaint({
      title,
      message,
      user: req.user.id,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted",
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ALL (ADMIN) =================
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name phone")
      .sort({ createdAt: -1 });

    res.json(complaints);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE STATUS =================
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = "resolved";

    await complaint.save();

    res.json({
      message: "Complaint marked as resolved",
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};