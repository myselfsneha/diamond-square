const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");
const axios = require("axios");

// ==============================
// Helper - Generate OTP
// ==============================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==============================
// Register
// ==============================
// ==============================
// Register
// ==============================
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      resident_type,
      flat_number,
      emergency_contact,
      occupation,
      date_of_birth,
      anniversary_date,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !resident_type ||
      !flat_number ||
      !date_of_birth
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (!["owner", "tenant"].includes(resident_type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Resident type must be Owner or Tenant.",
      });
    }

    const [existingUsers] = await db.query(
      `SELECT id FROM users WHERE email=? OR phone=?`,
      [
        email.trim().toLowerCase(),
        phone.trim(),
      ]
    );

    if (existingUsers.length) {
      return res.status(400).json({
        success: false,
        message: "Resident already exists.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        phone,
        password,
        role,
        resident_type,
        flat_number,
        emergency_contact,
        occupation,
        date_of_birth,
        anniversary_date,
        approval_status,
        approval_otp,
        otp_expires_at,
        otp_verified,
        is_active
      )
      VALUES
      (
        ?,?,?,?,?,?,?,?,?,?,
        ?,
        'pending',
        NULL,
        NULL,
        0,
        1
      )
      `,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        hashedPassword,
        "resident",
        resident_type.toLowerCase(),
        flat_number.trim().toUpperCase(),
        emergency_contact || null,
        occupation || null,
        date_of_birth,
        anniversary_date || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message:
        "Registration submitted successfully. Please wait for admin approval.",
      userId: result.insertId,
    });

  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Login
// ==============================
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password are required.",
      });
    }

    const [users] = await db.query(
      `SELECT * FROM users WHERE phone = ?`,
      [phone.trim()]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const user = users[0];

    if (user.approval_status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is awaiting admin approval.",
      });
    }

    if (user.is_active === 0) {
      return res.status(403).json({
        success: false,
        message: "Your account has been temporarily suspended.",
      });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password.",
      });
    }

    const token = generateToken(user.id, user.role);

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      resident_type: user.resident_type,
      flat_number: user.flat_number,
      approval_status: user.approval_status,
      profile_image: user.profile_image,
      emergency_contact: user.emergency_contact,
      occupation: user.occupation,
      date_of_birth: user.date_of_birth,
      anniversary_date: user.anniversary_date,
      is_active: user.is_active,
      canSwitchToAdmin: user.role === "admin",
    };

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: userData,
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// Verify OTP (MSG91)
// ==============================
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, accessToken } = req.body;

    if (!phone || !accessToken) {
      return res.status(400).json({
        success: false,
        message: "Phone number and access token are required.",
      });
    }

    const response = await axios.post(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        authkey: process.env.MSG91_AUTH_KEY,
        "access-token": accessToken,
      }
    );

    if (!response.data || response.data.type !== "success") {
      return res.status(400).json({
        success: false,
        message: "OTP verification failed.",
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE phone = ?",
      [phone]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const user = users[0];

    await db.query(
      `
      UPDATE users
      SET
        approval_status='approved',
        otp_verified=1
      WHERE id=?
      `,
      [user.id]
    );

    const token = generateToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        resident_type: user.resident_type,
        flat_number: user.flat_number,
        approval_status: "approved",
        is_active: user.is_active,
      },
    });

  } catch (err) {
    console.error(err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed.",
    });
  }
};

// ==============================
// Verify OTP (Manual)
// ==============================
exports.verifyOtpWithCode = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });
    }

    const [users] = await db.query(
      `SELECT * FROM users WHERE phone = ?`,
      [phone.trim()]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const user = users[0];

    if (
      user.approval_otp !== otp ||
      !user.otp_expires_at ||
      new Date(user.otp_expires_at) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    await db.query(
      `
      UPDATE users
      SET
        approval_status = 'approved',
        otp_verified = 1,
        approval_otp = NULL,
        otp_expires_at = NULL
      WHERE id = ?
      `,
      [user.id]
    );

    const token = generateToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        resident_type: user.resident_type,
        flat_number: user.flat_number,
        profile_image: user.profile_image,
        approval_status: "approved",
        is_active: user.is_active,
      },
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Get Profile
// ==============================
exports.getProfile = async (req, res) => {
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
        profile_image,
        emergency_contact,
        occupation,
        approval_status,
        otp_verified,
        is_active,
        date_of_birth,
        anniversary_date,
        created_at
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: users[0],
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// Update Profile
// ==============================
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      resident_type,
      flat_number,
      emergency_contact,
      occupation,
      date_of_birth,
      anniversary_date,
    } = req.body;

    if (
      resident_type &&
      !["owner", "tenant"].includes(resident_type.toLowerCase())
    ) {
      return res.status(400).json({
        success: false,
        message: "Resident type must be Owner or Tenant.",
      });
    }

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        email = ?,
        phone = ?,
        resident_type = ?,
        flat_number = ?,
        emergency_contact = ?,
        occupation = ?,
        date_of_birth = ?,
        anniversary_date = ?
      WHERE id = ?
      `,
      [
        name?.trim(),
        email?.trim().toLowerCase(),
        phone?.trim(),
        resident_type?.toLowerCase(),
        flat_number?.trim().toUpperCase(),
        emergency_contact || null,
        occupation || null,
        date_of_birth || null,
        anniversary_date || null,
        req.user.id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Change Password
// ==============================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [users] = await db.query(
      `
      SELECT password
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const passwordMatched = await bcrypt.compare(
      currentPassword,
      users[0].password
    );

    if (!passwordMatched) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      `
      UPDATE users
      SET password = ?
      WHERE id = ?
      `,
      [hashedPassword, req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });

  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// Upload Profile Image
// ==============================
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a profile image.",
      });
    }

    await db.query(
      `
      UPDATE users
      SET profile_image = ?
      WHERE id = ?
      `,
      [req.file.filename, req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      profile_image: req.file.filename,
    });

  } catch (error) {
    console.error("Upload Profile Image Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Switch Dashboard
// ==============================
exports.switchDashboard = async (req, res) => {
  try {
    const { mode } = req.body;

    if (!["resident", "admin"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid dashboard mode.",
      });
    }

    const [users] = await db.query(
      `
      SELECT role
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (mode === "admin" && users[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      mode,
      message: `Switched to ${mode} dashboard successfully.`,
    });

  } catch (error) {
    console.error("Switch Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// Logout
// ==============================
exports.logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};


// ==============================
// Forgot Password
// ==============================
exports.forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    const [users] = await db.query(
      `SELECT id FROM users WHERE phone = ?`,
      [phone.trim()]
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
      SET
        approval_otp = ?,
        otp_expires_at = ?
      WHERE phone = ?
      `,
      [otp, expiry, phone.trim()]
    );

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully.",

      // Remove this in production
      otp,
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// Reset Password
// ==============================
exports.resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Phone, OTP and new password are required.",
      });
    }

    const [users] = await db.query(
      `SELECT * FROM users WHERE phone = ?`,
      [phone.trim()]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const user = users[0];

    if (
      user.approval_otp !== otp ||
      !user.otp_expires_at ||
      new Date(user.otp_expires_at) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      `
      UPDATE users
      SET
        password = ?,
        approval_otp = NULL,
        otp_expires_at = NULL
      WHERE id = ?
      `,
      [hashedPassword, user.id]
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });

  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};