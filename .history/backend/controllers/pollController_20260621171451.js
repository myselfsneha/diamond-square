const db = require("../config/db");

// Get all polls
exports.getPolls = (req, res) => {
  db.query(
    "SELECT * FROM polls ORDER BY created_at DESC",
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

// Create poll
exports.createPoll = (req, res) => {
  const { question, option1, option2 } = req.body;

  db.query(
    `INSERT INTO polls
    (question, option1, option2)
    VALUES (?, ?, ?)`,
    [question, option1, option2],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        id: result.insertId,
        question,
        option1,
        option2,
      });
    }
  );
};

// Delete poll
exports.deletePoll = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM polls WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Poll deleted successfully",
      });
    }
  );
};