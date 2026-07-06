const db = require("../config/db");

// Get all polls with vote counts
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

// Vote on a poll
exports.votePoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const { option } = req.body;
    const userId = req.user.id;

    if (
      option !== "option1" &&
      option !== "option2"
    ) {
      return res.status(400).json({
        message: "Invalid option selected",
      });
    }

    const [existingVote] = await db.query(
      `SELECT *
       FROM poll_votes
       WHERE poll_id = ? AND user_id = ?`,
      [pollId, userId]
    );

    if (existingVote.length > 0) {
      return res.status(400).json({
        message: "You have already voted.",
      });
    }

    const voteColumn =
      option === "option1"
        ? "votes_option1"
        : "votes_option2";

    const [pollResult] = await db.query(
      `UPDATE polls
       SET ${voteColumn} = ${voteColumn} + 1
       WHERE id = ?`,
      [pollId]
    );

    if (pollResult.affectedRows === 0) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    await db.query(
      `INSERT INTO poll_votes
      (poll_id, user_id, selected_option)
      VALUES (?, ?, ?)`,
      [pollId, userId, option]
    );

    res.json({
      message: "Vote submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};