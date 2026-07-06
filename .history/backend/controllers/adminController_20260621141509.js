const db = require("../config/db");

// Get all pending users
exports.getPendingUsers = (req, res) => {
  db.query(
    "SELECT id, name, email, phone, approval_status FROM users WHERE approval_status = 'pending'",
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
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
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
    "SELECT id, name, email, phone, role, approval_status FROM users",
    (err, results) => {
      if (err) {
        console.log("DB Error:", err);

        return res.status(500).json({
          message: err.message,
        });
      }

      console.log("Residents Found:", results);

      res.json(results);
    }
  );
};

// Delete resident
exports.deleteResident = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM users WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Resident deleted successfully",
      });
    }
  );
};