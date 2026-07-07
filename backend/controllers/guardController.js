const db = require("../config/db");

// ==============================
// Get All Guards
// ==============================
exports.getGuards = async (req, res) => {
  try {
    const { rows: guards } = await db.query(`
      SELECT *
      FROM guards
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      guards,
    });
  } catch (error) {
    console.error("Get Guards Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Create Guard
// ==============================
exports.createGuard = async (req, res) => {
  try {
    const { name, phone, shift } = req.body;

    if (!name || !phone || !shift) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and shift are required.",
      });
    }

    const result = await db.query(
      `
      INSERT INTO guards
      (
        name,
        phone,
        shift
      )
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [
        name.trim(),
        phone.trim(),
        shift.trim(),
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Guard added successfully.",
      guardId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Create Guard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Guard
// ==============================
exports.deleteGuard = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM guards WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Guard not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Guard deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Guard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};