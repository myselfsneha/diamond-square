const Visitor = require("../models/Visitor");

// Pre-register visitor
exports.preRegisterVisitor = async (req, res) => {
  try {
    const { visitorName, phone, flatNumber } = req.body;

    const visitor = new Visitor({
      visitorName,
      phone,
      flatNumber
    });

    await visitor.save();

    res.status(201).json({
      message: "Visitor pre-registered",
      visitor
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Visitor entry
exports.entryVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findByIdAndUpdate(
      id,
      { entryTime: new Date(), status: "inside" },
      { new: true }
    );

    res.json({
      message: "Visitor entered",
      visitor
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Visitor exit
exports.exitVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findByIdAndUpdate(
      id,
      { exitTime: new Date(), status: "exited" },
      { new: true }
    );

    res.json({
      message: "Visitor exited",
      visitor
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all visitors
exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.json(visitors);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};