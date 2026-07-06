const db = require("../config/db");

// Create Notice (Admin)
exports.createNotice = (req, res) => {
  const { title, description } = req.body;

  db.query(
    `INSERT INTO notices
    (title, description, created_by)
    VALUES (?, ?, ?)`,
    [title, description, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.status(201).json({
        message: "Notice created successfully"
      });
    }
  );
};

// Get All Notices
exports.getAllNotices = (req, res) => {
  db.query(
    `
    SELECT
      n.id,
      n.title,
      n.description,
      n.created_at,
      u.name AS created_by
    FROM notices n
    JOIN users u ON n.created_by = u.id
    ORDER BY n.created_at DESC
    `,
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json(results);
    }
  );
};