const db = require("../config/db");

// Admin - Add Maintenance
exports.createMaintenance = (req, res) => {
  const { flat_id, amount, due_date } = req.body;

  db.query(
    `INSERT INTO maintenance_reminders
    (flat_id, amount, due_date)
    VALUES (?, ?, ?)`,
    [flat_id, amount, due_date],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.status(201).json({
        message: "Maintenance reminder created"
      });
    }
  );
};

// Resident - View My Maintenance
exports.getMyMaintenance = (req, res) => {
  db.query(
    `
    SELECT
      mr.*
    FROM maintenance_reminders mr
    JOIN resident_profiles rp
      ON mr.flat_id = rp.flat_id
    WHERE rp.user_id = ?
    `,
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json(results);
    }
  );
};

// Admin - Update Status
exports.updateMaintenanceStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    `UPDATE maintenance_reminders
     SET status = ?
     WHERE id = ?`,
    [status, id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        message: "Maintenance status updated"
      });
    }
  );
};