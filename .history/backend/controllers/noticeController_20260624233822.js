const db = require("../config/db");

// Create Notice (Admin)
exports.createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO notices
      (title, description, created_by)
      VALUES (?, ?, ?)`,
      [title, description, req.user.id]
    );

    res.status(201).json({
      message: "Notice created successfully",
      noticeId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Notices
exports.getAllNotices = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT
        n.id,
        n.title,
        n.description,
        n.created_at,
        u.name AS created_by
      FROM notices n
      JOIN users u
        ON n.created_by = u.id
      ORDER BY n.created_at DESC
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Notice (Admin)
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM notices WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.json({
      message: "Notice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};