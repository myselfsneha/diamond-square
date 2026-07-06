const db = require("../config/db");

// Get all polls with vote counts
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

// Vote on a poll
exports.votePoll = (req, res) => {
  const pollId = req.params.id;
  const { option } = req.body;
  const userId = req.user.id;

  db.query(
    "SELECT * FROM poll_votes WHERE poll_id = ? AND user_id = ?",
    [pollId, userId],
    (err, existingVote) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (existingVote.length > 0) {
        return res.status(400).json({
          message: "You have already voted.",
        });
      }

      const voteColumn =
        option === "option1"
          ? "votes_option1"
          : "votes_option2";

      db.query(
        `UPDATE polls
         SET ${voteColumn} = ${voteColumn} + 1
         WHERE id = ?`,
        [pollId],
        (err) => {
          if (err) {
            return res.status(500).json({
              message: err.message,
            });
          }

          db.query(
            `INSERT INTO poll_votes
             (poll_id, user_id, selected_option)
             VALUES (?, ?, ?)`,
            [pollId, userId, option],
            (err) => {
              if (err) {
                return res.status(500).json({
                  message: err.message,
                });
              }

              res.json({
                message: "Vote submitted successfully",
              });
            }
          );
        }
      );
    }
  );
};