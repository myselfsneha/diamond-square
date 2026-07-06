const db = require("../config/db");

// Get all visitors
exports.getVisitors = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM visitors ORDER BY created_at DESC"
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add visitor
exports.createVisitor = async (req, res) => {
  try {
    const { name, phone, purpose } = req.body;

    if (!name || !phone || !purpose) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO visitors
      (name, phone, purpose)
      VALUES (?, ?, ?)`,
      [name, phone, purpose]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      phone,
      purpose,
      message: "Visitor added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete visitor
exports.deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM visitors WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json({
      message: "Visitor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};