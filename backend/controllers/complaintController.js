const Complaint = require("../models/Complaint");

// Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, flatNumber } = req.body;

    const complaint = new Complaint({
      title,
      description,
      flatNumber,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all complaints
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update complaint status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json({
      message: "Status updated",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};