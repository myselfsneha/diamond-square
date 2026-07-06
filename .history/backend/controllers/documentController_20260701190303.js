const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// ================================
// Get All Documents
// ================================
exports.getDocuments = async (req, res) => {
  try {
    const [documents] = await db.query(`
      SELECT
        d.*,
        u.name AS uploaded_by_name
      FROM documents d
      LEFT JOIN users u
        ON d.uploaded_by = u.id
      ORDER BY d.created_at DESC
    `);

    res.json(documents);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================================
// Upload Document
// ================================
exports.uploadDocument = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a file.",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO documents
      (
        title,
        description,
        category,
        file_name,
        file_path,
        uploaded_by
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        description,
        category || "Other",
        req.file.originalname,
        req.file.filename,
        req.user.id,
      ]
    );

    res.status(201).json({
      message: "Document uploaded successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================================
// Download Document
// ================================
exports.downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM documents
      WHERE id=?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    const document = rows[0];

    const filePath = path.join(
      __dirname,
      "../uploads/documents",
      document.file_path
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File not found.",
      });
    }

    res.download(filePath, document.file_name);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================================
// Delete Document
// ================================
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM documents
      WHERE id=?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    const document = rows[0];

    const filePath = path.join(
      __dirname,
      "../uploads/documents",
      document.file_path
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.query(
      `
      DELETE FROM documents
      WHERE id=?
      `,
      [id]
    );

    res.json({
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};