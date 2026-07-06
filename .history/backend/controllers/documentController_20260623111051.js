const db = require("../config/db");

// Get all documents
exports.getDocuments = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM documents ORDER BY created_at DESC"
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create document
exports.createDocument = async (req, res) => {
  try {
    const { title, description, file_url } = req.body;

    if (!title || !file_url) {
      return res.status(400).json({
        message: "Title and file URL are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO documents
      (title, description, file_url)
      VALUES (?, ?, ?)`,
      [
        title,
        description || "",
        file_url,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      description,
      file_url,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM documents WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};