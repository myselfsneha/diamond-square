const db = require("../config/db");

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =====================================
// Approve Resident
// =====================================
exports.approveResident = async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await db.query(
      "SELECT * FROM users WHERE id=?",
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const otp = generateOTP();

    const expiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await db.query(
      `
      UPDATE users
      SET
        approval_status='approved',
        approval_otp=?,
        otp_expires_at=?,
        otp_verified=0
      WHERE id=?
      `,
      [otp, expiry, userId]
    );

    return res.json({
      success: true,
      message: "Resident approved successfully.",
      otp, // Remove this in production after SMS is integrated
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Pending Residents
// ===============================
exports.getPendingUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        role,
        resident_type,
        flat_number,
        approval_status,
        created_at
      FROM users
      WHERE approval_status = 'pending'
      ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Residents
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        role,
        resident_type,
        flat_number,
        approval_status,
        is_active,
        created_at
      FROM users
      ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Approve Resident
// ===============================
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      UPDATE users
      SET approval_status = 'approved'
      WHERE id = ?
      `,
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

// ===============================
// Reject Resident
// ===============================
exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    await db.query(
      `
      UPDATE users
      SET
        approval_status = 'rejected',
        rejection_reason = ?
      WHERE id = ?
      `,
      [reason || "Rejected by admin", id]
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

// ===============================
// Activate / Deactivate Resident
// ===============================
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      "SELECT is_active FROM users WHERE id = ?",
      [id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const newStatus = users[0].is_active ? 0 : 1;

    await db.query(
      `
      UPDATE users
      SET is_active = ?
      WHERE id = ?
      `,
      [newStatus, id]
    );

    res.json({
      success: true,
      message:
        newStatus === 1
          ? "Resident activated."
          : "Resident deactivated.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// Toggle Admin Role
// ===============================
exports.toggleAdminRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from changing their own role
    if (Number(req.user.id) === Number(id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own admin role.",
      });
    }

    const [users] = await db.query(
      "SELECT role FROM users WHERE id = ?",
      [id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const newRole =
      users[0].role === "admin"
        ? "resident"
        : "admin";

    await db.query(
      `
      UPDATE users
      SET role = ?
      WHERE id = ?
      `,
      [newRole, id]
    );

    res.json({
      success: true,
      message:
        newRole === "admin"
          ? "User promoted to Admin."
          : "Admin changed to Resident.",
      role: newRole,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// Delete Resident
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (Number(req.user.id) === Number(id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const [users] = await db.query(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await db.query(
      "DELETE FROM users WHERE id = ?",
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

exports.approveResident = async (req, res) => {
  try {
    const { userId } = req.params;

    const otp = generateOTP();

    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const [users] = await db.query(
      "SELECT * FROM users WHERE id=?",
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    await db.query(
      `
      UPDATE users
      SET
        approval_status='approved',
        approval_otp=?,
        otp_expires_at=?,
        otp_verified=0
      WHERE id=?
      `,
      [otp, expiry, userId]
    );

    // =============================
    // SMS / Email Integration
    // =============================
    // Replace this console.log with Twilio/Fast2SMS later.
    console.log(
      `OTP for ${users[0].phone}: ${otp}`
    );

    return res.json({
      success: true,
      message: "Resident approved successfully. OTP generated.",
      otp, // Remove this after SMS is integrated
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};