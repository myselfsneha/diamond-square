const db = require("../config/db");

// Get all polls
exports.getPolls = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM polls ORDER BY created_at DESC"
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create poll
exports.createPoll = async (req, res) => {
  try {
    const {
      question,
      option1,
      option2,
    } = req.body;

    if (
      !question ||
      !option1 ||
      !option2
    ) {
      return res.status(400).json({
        message:
          "Question, option1 and option2 are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO polls
      (question, option1, option2)
      VALUES (?, ?, ?)`,
      [
        question,
        option1,
        option2,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      question,
      option1,
      option2,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete poll
exports.deletePoll = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM polls WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    res.json({
      message: "Poll deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};