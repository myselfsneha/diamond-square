const Maintenance = require("../models/Maintenance");

// Add maintenance record
exports.addMaintenance = async (req, res) => {
  try {
    const { flatNumber, amount, dueDate } = req.body;

    const maintenance = new Maintenance({
      flatNumber,
      amount,
      dueDate
    });

    await maintenance.save();

    res.status(201).json({
      message: "Maintenance added",
      maintenance
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all maintenance records
exports.getMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.find().sort({ createdAt: -1 });

    res.json(records);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark as paid
exports.markPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Maintenance.findByIdAndUpdate(
      id,
      { status: "paid" },
      { new: true }
    );

    res.json({
      message: "Payment updated",
      record
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};