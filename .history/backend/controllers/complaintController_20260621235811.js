const db = require("../config/db");

// Create Complaint
exports.createComplaint = (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description are required",
    });
  }

  db.query(
    `INSERT INTO complaints
    (user_id, title, description, status)
    VALUES (?, ?, ?, ?)`,
    [
      req.user.id,
      title,
      description,
      "Pending",
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message: "Complaint submitted successfully",
        complaintId: result.insertId,
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
          message: err.message,
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
     JOIN users u
       ON c.user_id = u.id
     ORDER BY c.created_at DESC`,
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json(results);
    }
  );
};

// Admin - Update Complaint Status
exports.updateComplaintStatus = (
  req,
  res
) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "In Progress",
    "Resolved",
  ];

  if (
    !allowedStatuses.includes(status)
  ) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  db.query(
    `UPDATE complaints
     SET status = ?
     WHERE id = ?`,
    [status, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      res.json({
        message:
          "Complaint status updated successfully",
      });
    }
  );
};