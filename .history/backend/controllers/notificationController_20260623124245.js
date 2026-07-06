const db = require("../config/db");

// Get all notifications
exports.getNotifications = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM notifications ORDER BY created_at DESC"
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create notification (Admin)
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({
        message: "Title, message and type are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO notifications
      (title, message, type)
      VALUES (?, ?, ?)`,
      [title, message, type]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      message,
      type,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM notifications WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};