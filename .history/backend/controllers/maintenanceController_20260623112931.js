const db = require("../config/db");

// Admin - Add Maintenance
exports.createMaintenance = async (req, res) => {
  try {
    const { flat_id, amount, due_date } = req.body;

    if (!flat_id || !amount || !due_date) {
      return res.status(400).json({
        message: "Flat ID, amount and due date are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO maintenance_reminders
      (flat_id, amount, due_date)
      VALUES (?, ?, ?)`,
      [flat_id, amount, due_date]
    );

    res.status(201).json({
      message: "Maintenance reminder created",
      maintenanceId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Resident - View My Maintenance
exports.getMyMaintenance = async (req, res) => {
  try {
    const [results] = await db.query(
      `
      SELECT
        mr.*
      FROM maintenance_reminders mr
      JOIN resident_profiles rp
        ON mr.flat_id = rp.flat_id
      WHERE rp.user_id = ?
      ORDER BY mr.due_date DESC
      `,
      [req.user.id]
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin - Update Maintenance Status
exports.updateMaintenanceStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Paid",
      "Overdue",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const [result] = await db.query(
      `UPDATE maintenance_reminders
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Maintenance record not found",
      });
    }

    res.json({
      message:
        "Maintenance status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};