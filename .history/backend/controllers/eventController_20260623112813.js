const db = require("../config/db");

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM events ORDER BY event_date DESC"
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const { title, date, description } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        message: "Title and date are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO events
      (title, event_date, description)
      VALUES (?, ?, ?)`,
      [
        title,
        date,
        description || "",
      ]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      date,
      description,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM events WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};