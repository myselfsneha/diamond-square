const db = require("../config/db");

exports.getPolls = async (req, res) => {
  try {
    const { rows: polls } = await db.query(`
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

    const { rows } = await db.query(
      `
      SELECT *
      FROM polls
      WHERE id = $1
      `,
      [id]
    );

    const poll = rows[0];

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

    const { rows } = await db.query(
      `
      INSERT INTO polls
      (
        question,
        option1,
        option2,
        votes_option1,
        votes_option2
      )
      VALUES ($1, $2, $3, 0, 0)
      RETURNING id
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
      pollId: rows[0].id,
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

    const result = await db.query(
      `
      UPDATE polls
      SET
        question = $1,
        option1 = $2,
        option2 = $3
      WHERE id = $4
      `,
      [
        question,
        option1,
        option2,
        id,
      ]
    );

    if (result.rowCount === 0) {
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

    const { rows: polls } = await db.query(
      `
      SELECT id
      FROM polls
      WHERE id = $1
      `,
      [id]
    );

    if (!polls.length) {
      return res.status(404).json({
        success: false,
        message: "Poll not found.",
      });
    }

    const { rows: existingVote } = await db.query(
      `
      SELECT id
      FROM poll_votes
      WHERE poll_id = $1
      AND user_id = $2
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
      WHERE id = $1
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
      VALUES ($1, $2, $3)
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

    const { rows } = await db.query(
      `
      SELECT
        id,
        question,
        option1,
        option2,
        votes_option1,
        votes_option2
      FROM polls
      WHERE id = $1
      `,
      [id]
    );

    const poll = rows[0];

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

    const result = await db.query(
      `
      DELETE FROM polls
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
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