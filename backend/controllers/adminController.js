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

    const { rows: users } = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      `
      UPDATE users
      SET approval_status='approved',
          approval_otp=$1,
          otp_expires_at=$2,
          otp_verified=false
      WHERE id=$3
      `,
      [otp, expiry, userId]
    );

    return res.json({
      success: true,
      message: "Resident approved successfully.",
      otp,
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
    const { rows: users } = await db.query(`
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
    `);

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
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
    const { rows: users } = await db.query(`
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
    `);

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
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
      WHERE id = $1
      `,
      [id]
    );

    return res.json({
      success: true,
      message: "Resident approved successfully.",
    });
  } catch (error) {
    return res.status(500).json({
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
        rejection_reason = $1
      WHERE id = $2
      `,
      [reason || "Rejected by admin", id]
    );

    return res.json({
      success: true,
      message: "Resident rejected successfully.",
    });
  } catch (error) {
    return res.status(500).json({
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

    const { rows: users } = await db.query(
      "SELECT is_active FROM users WHERE id = $1",
      [id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const newStatus = !users[0].is_active;

    await db.query(
      `
      UPDATE users
      SET is_active = $1
      WHERE id = $2
      `,
      [newStatus, id]
    );

    return res.json({
      success: true,
      message: newStatus
        ? "Resident activated."
        : "Resident deactivated.",
    });
  } catch (error) {
    return res.status(500).json({
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

    if (Number(req.user.id) === Number(id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own admin role.",
      });
    }

    const { rows: users } = await db.query(
      "SELECT role FROM users WHERE id = $1",
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
      SET role = $1
      WHERE id = $2
      `,
      [newRole, id]
    );

    return res.json({
      success: true,
      message:
        newRole === "admin"
          ? "User promoted to Admin."
          : "Admin changed to Resident.",
      role: newRole,
    });
  } catch (error) {
    return res.status(500).json({
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

    if (Number(req.user.id) === Number(id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const { rows: users } = await db.query(
      "SELECT id FROM users WHERE id = $1",
      [id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await db.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );

    return res.json({
      success: true,
      message: "Resident deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// Approve Resident (Keep ONLY this one)
// Delete the duplicate approveResident above.
// ===============================
exports.approveResident = async (req, res) => {
  try {
    const { userId } = req.params;

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const { rows: users } = await db.query(
      "SELECT * FROM users WHERE id = $1",
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
        approval_status = 'approved',
        approval_otp = $1,
        otp_expires_at = $2,
        otp_verified = false
      WHERE id = $3
      `,
      [otp, expiry, userId]
    );

    console.log(`OTP for ${users[0].phone}: ${otp}`);

    return res.json({
      success: true,
      message: "Resident approved successfully. OTP generated.",
      otp,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};