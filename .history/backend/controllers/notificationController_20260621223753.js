const db = require("../config/db");

// Get all notifications
exports.getNotifications = (req, res) => {
  db.query(
    "SELECT * FROM notifications ORDER BY created_at DESC",
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

// Create notification (Admin)
exports.createNotification = (req, res) => {
  const { title, message, type } = req.body;

  db.query(
    `INSERT INTO notifications
    (title, message, type)
    VALUES (?, ?, ?)`,
    [title, message, type],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        id: result.insertId,
        title,
        message,
        type,
      });
    }
  );
};

// Delete notification
exports.deleteNotification = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM notifications WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Notification deleted successfully",
      });
    }
  );
};