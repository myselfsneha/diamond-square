const db = require("../config/db");

exports.getPendingUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT
        id,
        name,
        email,
        phone,
        flat_number,
        role,
        approval_status,
        profile_image,
        created_at
      FROM users
      WHERE approval_status = 'pending'
      ORDER BY created_at ASC
    `);

    return res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Pending Users:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch pending residents.",
      error: error.message,
    });
  }
};

exports.getPendingCount = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE approval_status='pending'
    `);

    return res.json({
      success: true,
      total: rows[0].total,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await db.query(
      `
      SELECT *
      FROM users
      WHERE id=?
      `,
      [id]
    );

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    if (user[0].approval_status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Resident already approved.",
      });
    }

    await db.query(
      `
      UPDATE users
      SET approval_status='approved'
      WHERE id=?
      `,
      [id]
    );

    return res.json({
      success: true,
      message: "Resident approved successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const [user] = await db.query(
      `
      SELECT id
      FROM users
      WHERE id=?
      `,
      [id]
    );

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    await db.query(
      `
      UPDATE users
      SET
        approval_status='rejected',
        rejection_reason=?
      WHERE id=?
      `,
      [reason || "Rejected by admin.", id]
    );

    return res.json({
      success: true,
      message: "Resident registration rejected.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getResidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found."
      });
    }

    return res.json({
      success: true,
      resident: users[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateResident = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      flat_number
    } = req.body;

    const [user] = await db.query(
      `SELECT id FROM users WHERE id = ?`,
      [id]
    );

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found."
      });
    }

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        email = ?,
        phone = ?,
        flat_number = ?
      WHERE id = ?
      `,
      [
        name?.trim(),
        email?.trim(),
        phone?.trim(),
        flat_number?.trim(),
        id
      ]
    );

    return res.json({
      success: true,
      message: "Resident updated successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteResident = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      `SELECT role FROM users WHERE id = ?`,
      [id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found."
      });
    }

    if (users[0].role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted."
      });
    }

    await db.query(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );

    return res.json({
      success: true,
      message: "Resident deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.toggleResidentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    await db.query(
      `
      UPDATE users
      SET is_active = ?
      WHERE id = ?
      `,
      [is_active, id]
    );

    return res.json({
      success: true,
      message: is_active
        ? "Resident activated successfully."
        : "Resident suspended successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};