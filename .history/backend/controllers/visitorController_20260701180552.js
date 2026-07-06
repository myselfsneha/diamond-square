const db = require("../config/db");

// Get all visitors
exports.getVisitors = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT *
      FROM visitors
      ORDER BY created_at DESC
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create visitor
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
      (name, phone, purpose, status)
      VALUES (?, ?, ?, ?)`,
      [name, phone, purpose, "Pending"]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      phone,
      purpose,
      status: "Pending",
      entry_time: null,
      exit_time: null,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Approve visitor
exports.approveVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE visitors
       SET status='Approved'
       WHERE id=?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json({
      message: "Visitor approved",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Mark entry
exports.markEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE visitors
       SET
         status='Entered',
         entry_time=NOW()
       WHERE id=?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json({
      message: "Entry recorded",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Mark exit
exports.markExit = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE visitors
       SET
         status='Exited',
         exit_time=NOW()
       WHERE id=?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json({
      message: "Exit recorded",
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
      "DELETE FROM visitors WHERE id=?",
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