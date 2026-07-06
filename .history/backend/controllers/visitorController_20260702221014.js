const db = require("../config/db");

exports.getVisitors = async (req, res) => {
  try {
    const [visitors] = await db.query(`
      SELECT
        v.id,
        v.resident_id,
        v.visitor_name,
        v.phone,
        v.purpose,
        v.visit_date,
        v.entry_time,
        v.exit_time,
        v.status,
        v.created_at,
        u.name AS resident_name,
        u.flat_number
      FROM visitors v
      LEFT JOIN users u
        ON v.resident_id = u.id
      ORDER BY v.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      visitors,
    });
  } catch (error) {
    console.error("Get Visitors Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createVisitor = async (req, res) => {
  try {
    const {
      visitor_name,
      phone,
      purpose,
      resident_id,
      visit_date,
    } = req.body;

    if (
      !visitor_name ||
      !phone ||
      !purpose ||
      !resident_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    const [[resident]] = await db.query(
      `SELECT id FROM users WHERE id = ?`,
      [resident_id]
    );

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO visitors
      (
        resident_id,
        visitor_name,
        phone,
        purpose,
        visit_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        resident_id,
        visitor_name,
        phone,
        purpose,
        visit_date || new Date(),
        "Pending",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Visitor request created successfully.",
      visitorId: result.insertId,
    });
  } catch (error) {
    console.error("Create Visitor Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.approveVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE visitors
      SET status = 'Approved'
      WHERE id = ?
      `,
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found.",
      });
    }

    return res.json({
      success: true,
      message: "Visitor approved successfully.",
    });
  } catch (error) {
    console.error("Approve Visitor Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE visitors
      SET
        status = 'Entered',
        entry_time = NOW()
      WHERE id = ?
      `,
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found.",
      });
    }

    return res.json({
      success: true,
      message: "Entry recorded successfully.",
    });
  } catch (error) {
    console.error("Mark Entry Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markExit = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE visitors
      SET
        status = 'Exited',
        exit_time = NOW()
      WHERE id = ?
      `,
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found.",
      });
    }

    return res.json({
      success: true,
      message: "Exit recorded successfully.",
    });
  } catch (error) {
    console.error("Mark Exit Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `DELETE FROM visitors WHERE id = ?`,
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found.",
      });
    }

    return res.json({
      success: true,
      message: "Visitor deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Visitor Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};