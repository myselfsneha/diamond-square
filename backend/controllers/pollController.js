const db = require("../config/db");

// =============================
// Get All Polls
// =============================
exports.getPolls = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM polls
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      polls: result.rows,
    });
  } catch (error) {
    console.error("Get Polls Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Poll By ID
// =============================
exports.getPollById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM polls
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Poll not found.",
      });
    }

    return res.status(200).json({
      success: true,
      poll: result.rows[0],
    });
  } catch (error) {
    console.error("Get Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Create Poll
// =============================
exports.createPoll = async (req, res) => {
  try {
    const { question, option1, option2 } = req.body;

    if (!question || !option1 || !option2) {
      return res.status(400).json({
        success: false,
        message: "Question, option1 and option2 are required.",
      });
    }

    const result = await db.query(
      `
      INSERT INTO polls
      (question, option1, option2)
      VALUES ($1,$2,$3)
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
      pollId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Create Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Poll
// =============================
exports.updatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, option1, option2 } = req.body;

    const result = await db.query(
      `
      UPDATE polls
      SET
        question=$1,
        option1=$2,
        option2=$3
      WHERE id=$4
      `,
      [question, option1, option2, id]
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

// =============================
// Delete Poll
// =============================
exports.deletePoll = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM polls
      WHERE id=$1
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

// =============================
// Vote Poll
// =============================
exports.votePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { option } = req.body;

    if (![1, 2].includes(Number(option))) {
      return res.status(400).json({
        success: false,
        message: "Invalid option selected.",
      });
    }

    const pollResult = await db.query(
      `SELECT * FROM polls WHERE id=$1`,
      [id]
    );

    if (pollResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Poll not found.",
      });
    }

    const column = Number(option) === 1 ? "votes1" : "votes2";

    await db.query(
      `UPDATE polls SET ${column}=${column}+1 WHERE id=$1`,
      [id]
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

// =============================
// Poll Results
// =============================
exports.getPollResults = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT
        id,
        question,
        option1,
        option2,
        votes1,
        votes2
      FROM polls
      WHERE id=$1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Poll not found.",
      });
    }

    return res.status(200).json({
      success: true,
      poll: result.rows[0],
    });
  } catch (error) {
    console.error("Poll Results Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};