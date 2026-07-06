const db = require("../config/db");
const fs = require("fs");
const path = require("path");

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

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Get Documents Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Document title is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
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
        title.trim(),
        description?.trim() || null,
        category?.trim() || "Other",
        req.file.originalname,
        req.file.filename,
        req.user.id,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      documentId: result.insertId,
    });
  } catch (error) {
    console.error("Upload Document Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const [documents] = await db.query(
      `
      SELECT *
      FROM documents
      WHERE id = ?
      `,
      [id]
    );

    if (!documents.length) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    const document = documents[0];

    const filePath = path.join(
      __dirname,
      "../uploads/documents",
      document.file_path
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    return res.download(filePath, document.file_name);
  } catch (error) {
    console.error("Download Document Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const [documents] = await db.query(
      `
      SELECT *
      FROM documents
      WHERE id = ?
      `,
      [id]
    );

    if (!documents.length) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    const document = documents[0];

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
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Document Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};