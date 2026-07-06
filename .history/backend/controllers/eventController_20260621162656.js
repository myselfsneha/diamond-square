const db = require("../config/db");

// Get all events
exports.getEvents = (req, res) => {
  db.query(
    "SELECT * FROM events ORDER BY event_date DESC",
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

// Create event
exports.createEvent = (req, res) => {
  const { title, date, description } = req.body;

  db.query(
    `INSERT INTO events
    (title, event_date, description)
    VALUES (?, ?, ?)`,
    [title, date, description],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        id: result.insertId,
        title,
        date,
        description,
      });
    }
  );
};

// Delete event
exports.deleteEvent = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM events WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Event deleted successfully",
      });
    }
  );
};