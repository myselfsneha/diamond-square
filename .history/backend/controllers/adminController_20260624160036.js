const db = require("../config/db");

// Get all pending users
exports.getPendingUsers = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT
        id,
        name,
        email,
        phone,
        flat_number,
        approval_status
      FROM users
      WHERE approval_status = 'pending'
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Approve user
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE users SET approval_status = 'approved' WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all residents
exports.getAllResidents = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT
        id,
        name,
        email,
        phone,
        flat_number,
        profile_image,
        role,
        approval_status
      FROM users
      ORDER BY name ASC
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete resident
exports.deleteResident = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      "SELECT role FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "Resident not found",
      });
    }

    if (users[0].role === "admin") {
      return res.status(403).json({
        message: "Admin account cannot be deleted",
      });
    }

    await db.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    res.json({
      message: "Resident deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};