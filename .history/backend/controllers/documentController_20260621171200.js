const db = require("../config/db");

// Get all documents
exports.getDocuments = (req, res) => {
  db.query(
    "SELECT * FROM documents ORDER BY created_at DESC",
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

// Create document
exports.createDocument = (req, res) => {
  const { title, description, file_url } = req.body;

  db.query(
    `INSERT INTO documents
    (title, description, file_url)
    VALUES (?, ?, ?)`,
    [title, description, file_url],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        id: result.insertId,
        title,
        description,
        file_url,
      });
    }
  );
};

// Delete document
exports.deleteDocument = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM documents WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Document deleted successfully",
      });
    }
  );
};