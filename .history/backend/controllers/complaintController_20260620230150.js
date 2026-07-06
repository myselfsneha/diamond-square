const db = require("../config/db");

// Create Complaint
exports.createComplaint = (req, res) => {
  const { title, description } = req.body;

  db.query(
    `INSERT INTO complaints
    (user_id, title, description)
    VALUES (?, ?, ?)`,
    [req.user.id, title, description],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.status(201).json({
        message: "Complaint submitted successfully"
      });
    }
  );
};

// Resident - My Complaints
exports.getMyComplaints = (req, res) => {
  db.query(
    `SELECT *
     FROM complaints
     WHERE user_id = ?
     ORDER BY created_at DESC`,
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

// Admin - All Complaints
exports.getAllComplaints = (req, res) => {
  db.query(
    `SELECT
        c.*,
        u.name,
        u.phone
     FROM complaints c
     JOIN users u ON c.user_id = u.id
     ORDER BY c.created_at DESC`,
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
exports.updateComplaintStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    `UPDATE complaints
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
        message: "Complaint status updated"
      });
    }
  );
};