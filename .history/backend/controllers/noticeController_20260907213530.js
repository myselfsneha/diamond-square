const db = require("../config/db");

// ==============================
// Create Notice (Admin)
// ==============================
exports.createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log("Creating notifications...");

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    const result = await db.query(
      `
      INSERT INTO notices
      (title, description, created_by)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [trimmedTitle, trimmedDescription, req.user.id]
    );

    const users = await db.query(
  "SELECT id FROM users WHERE role = 'resident'"
);

for (const user of users.rows) {
  await db.query(
    `
    INSERT INTO notifications
    (resident_id, title, message, type, created_by)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [
      user.id,
      "New Notice",
      description,
      "notice",
      req.user.id,
    ]
  );
}
};
// ==============================
// Get All Notices
// ==============================
exports.getAllNotices = async (req, res) => {
  try {
    const { rows } = await db.query(`
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

    res.json(rows);
  } catch (error) {
    console.error("Get Notices Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Delete Notice (Admin)
// ==============================
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM notices WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.json({
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("Delete Notice Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};