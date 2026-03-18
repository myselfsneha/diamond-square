const Maintenance = require("../models/Maintenance");

// ================= CREATE BILL (ADMIN) =================
exports.createMaintenance = async (req, res) => {
  try {
    const { amount, month, userId } = req.body;

    const maintenance = new Maintenance({
      amount,
      month,
      user: userId,
    });

    await maintenance.save();

    res.status(201).json({
      message: "Maintenance created",
      maintenance,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET MY BILLS =================
exports.getMyMaintenance = async (req, res) => {
  try {
    const bills = await Maintenance.find({ user: req.user.id });

    res.json(bills);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= MARK AS PAID =================
exports.markPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Maintenance.findById(id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    bill.status = "paid";
    await bill.save();

    res.json({
      message: "Payment successful",
      bill,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};