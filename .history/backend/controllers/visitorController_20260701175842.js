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

// Resident creates visitor request
exports.createVisitor = async (req, res) => {
  try {
    const { name, phone, purpose } = req.body;

    if (!name || !phone || !purpose) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const residentId = req.user?.id || null;

    const [result] = await db.query(
      `
      INSERT INTO visitors
      (
        resident_id,
        name,
        phone,
        purpose,
        status
      )
      VALUES (?, ?, ?, ?, 'Pending')
      `,
      [
        residentId,
        name,
        phone,
        purpose,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      resident_id: residentId,
      name,
      phone,
      purpose,
      status: "Pending",
      message: "Visitor request created",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin Approves Visitor
exports.approveVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE visitors
      SET status='Approved'
      WHERE id=?
      `,
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

// Guard marks Entry
exports.markEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE visitors
      SET
        status='Entered',
        entry_time=NOW()
      WHERE id=?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json({
      message: "Visitor entered",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Guard marks Exit
exports.markExit = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE visitors
      SET
        status='Exited',
        exit_time=NOW()
      WHERE id=?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json({
      message: "Visitor exited",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Visitor
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