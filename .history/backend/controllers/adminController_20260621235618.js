const db = require("../config/db");

// Get all pending users
exports.getPendingUsers = (req, res) => {
  db.query(
    `SELECT id, name, email, phone, approval_status
     FROM users
     WHERE approval_status = 'pending'`,
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

// Approve user
exports.approveUser = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE users SET approval_status = 'approved' WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "User approved successfully",
      });
    }
  );
};

// Get all residents
exports.getAllResidents = (req, res) => {
  db.query(
    `SELECT
      id,
      name,
      email,
      phone,
      role,
      approval_status
     FROM users`,
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

// Delete resident
exports.deleteResident = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT role FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Resident not found",
        });
      }

      if (results[0].role === "admin") {
        return res.status(403).json({
          message: "Admin account cannot be deleted",
        });
      }

      db.query(
        "DELETE FROM users WHERE id = ?",
        [id],
        (deleteErr) => {
          if (deleteErr) {
            return res.status(500).json({
              message: deleteErr.message,
            });
          }

          res.json({
            message: "Resident deleted successfully",
          });
        }
      );
    }
  );
};