const db = require("../config/db");

exports.getPolls = async (req, res) => {
  try {
    const [polls] = await db.query(`
      SELECT *
      FROM polls
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      polls,
    });
  } catch (error) {
    console.error("Get Polls Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPollById = async (req, res) => {
  try {
    const { id } = req.params;

    const [[poll]] = await db.query(
      `
      SELECT *
      FROM polls
      WHERE id = ?
      `,
      [id]
    );

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found.",
      });
    }

    return res.status(200).json({
      success: true,
      poll,
    });
  } catch (error) {
    console.error("Get Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createPoll = async (req, res) => {
  try {
    const { question, option1, option2 } = req.body;

    if (!question || !option1 || !option2) {
      return res.status(400).json({
        success: false,
        message: "Question, option1 and option2 are required.",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO polls
      (
        question,
        option1,
        option2,
        votes_option1,
        votes_option2
      )
      VALUES (?, ?, ?, 0, 0)
      `,
      [
        question.trim(),
        option1.trim(),
        option2.trim(),
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Poll created successfully.",
      pollId: result.insertId,
    });
  } catch (error) {
    console.error("Create Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, option1, option2 } = req.body;

    const [result] = await db.query(
      `
      UPDATE polls
      SET
        question = ?,
        option1 = ?,
        option2 = ?
      WHERE id = ?
      `,
      [
        question,
        option1,
        option2,
        id,
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Poll not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Poll updated successfully.",
    });
  } catch (error) {
    console.error("Update Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.votePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { option } = req.body;
    const userId = req.user.id;

    if (!["option1", "option2"].includes(option)) {
      return res.status(400).json({
        success: false,
        message: "Invalid option selected.",
      });
    }

    const [[poll]] = await db.query(
      `
      SELECT id
      FROM polls
      WHERE id = ?
      `,
      [id]
    );

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found.",
      });
    }

    const [existingVote] = await db.query(
      `
      SELECT id
      FROM poll_votes
      WHERE poll_id = ?
      AND user_id = ?
      `,
      [id, userId]
    );

    if (existingVote.length) {
      return res.status(400).json({
        success: false,
        message: "You have already voted.",
      });
    }

    const voteColumn =
      option === "option1"
        ? "votes_option1"
        : "votes_option2";

    await db.query(
      `
      UPDATE polls
      SET ${voteColumn} = ${voteColumn} + 1
      WHERE id = ?
      `,
      [id]
    );

    await db.query(
      `
      INSERT INTO poll_votes
      (
        poll_id,
        user_id,
        selected_option
      )
      VALUES (?, ?, ?)
      `,
      [
        id,
        userId,
        option,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Vote submitted successfully.",
    });
  } catch (error) {
    console.error("Vote Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPollResults = async (req, res) => {
  try {
    const { id } = req.params;

    const [[poll]] = await db.query(
      `
      SELECT
        id,
        question,
        option1,
        option2,
        votes_option1,
        votes_option2
      FROM polls
      WHERE id = ?
      `,
      [id]
    );

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found.",
      });
    }

    return res.status(200).json({
      success: true,
      poll,
    });
  } catch (error) {
    console.error("Poll Results Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePoll = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM polls
      WHERE id = ?
      `,
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Poll not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Poll deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};