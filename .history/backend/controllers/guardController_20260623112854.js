const db = require("../config/db");

// Get all guards
exports.getGuards = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM guards ORDER BY created_at DESC"
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add guard
exports.createGuard = async (req, res) => {
  try {
    const { name, phone, shift } = req.body;

    if (!name || !phone || !shift) {
      return res.status(400).json({
        message: "Name, phone and shift are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO guards
      (name, phone, shift)
      VALUES (?, ?, ?)`,
      [name, phone, shift]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      phone,
      shift,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete guard
exports.deleteGuard = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM guards WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Guard not found",
      });
    }

    res.json({
      message: "Guard deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};