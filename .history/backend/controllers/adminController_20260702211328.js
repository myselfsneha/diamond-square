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
      WHERE approval_status='pending'
      ORDER BY created_at ASC
    `);

    res.json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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

    res.json({
      success: true,
      total: rows[0].total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE users
       SET approval_status='approved'
       WHERE id=?`,
      [id]
    );

    res.json({
      success: true,
      message: "Resident approved successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    await db.query(
      `UPDATE users
       SET approval_status='rejected',
           rejection_reason=?
       WHERE id=?`,
      [reason || "Rejected by admin.", id]
    );

    res.json({
      success: true,
      message: "Resident rejected successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getResidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      "SELECT * FROM users WHERE id=?",
      [id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
      flat_number,
    } = req.body;

    await db.query(
      `UPDATE users
       SET
         name=?,
         email=?,
         phone=?,
         flat_number=?
       WHERE id=?`,
      [
        name,
        email,
        phone,
        flat_number,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Resident updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteResident = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM users WHERE id=?",
      [id]
    );

    res.json({
      success: true,
      message: "Resident deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.toggleResidentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    await db.query(
      `UPDATE users
       SET is_active=?
       WHERE id=?`,
      [is_active, id]
    );

    res.json({
      success: true,
      message: "Resident status updated.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ========= FIXED ========= */

exports.getAllResidents = async (req, res) => {
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
      WHERE role='resident'
      ORDER BY created_at DESC
    `);

    // Return an array so setUsers(res.data) works
    res.json(users);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};