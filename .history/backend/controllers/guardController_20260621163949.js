const db = require("../config/db");

// Get all guards
exports.getGuards = (req, res) => {
  db.query(
    "SELECT * FROM guards ORDER BY created_at DESC",
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

// Add guard
exports.createGuard = (req, res) => {
  const { name, phone, shift } = req.body;

  db.query(
    `INSERT INTO guards
    (name, phone, shift)
    VALUES (?, ?, ?)`,
    [name, phone, shift],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        id: result.insertId,
        name,
        phone,
        shift,
      });
    }
  );
};

// Delete guard
exports.deleteGuard = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM guards WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Guard deleted successfully",
      });
    }
  );
};