const db = require("../config/db");

// Get all visitors
exports.getVisitors = (req, res) => {
  db.query(
    "SELECT * FROM visitors ORDER BY created_at DESC",
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

// Add visitor
exports.createVisitor = (req, res) => {
  const { name, phone, purpose } = req.body;

  db.query(
    `INSERT INTO visitors
    (name, phone, purpose)
    VALUES (?, ?, ?)`,
    [name, phone, purpose],
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
        purpose,
      });
    }
  );
};

// Delete visitor
exports.deleteVisitor = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM visitors WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Visitor deleted successfully",
      });
    }
  );
};