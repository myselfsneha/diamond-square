const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");
const sendOTPEmail = require("../utils/sendOTPEmail");

// =====================================
// Helper Functions
// =====================================

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isPhone = (value) =>
  /^[6-9]\d{9}$/.test(value);

// =====================================
// Register
// =====================================

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

    if (!isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    if (!isPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    if (!["owner", "tenant"].includes(resident_type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Resident type must be owner or tenant.",
      });
    }

    const { rows: existing } = await db.query(
      `
      SELECT id
      FROM users
      WHERE LOWER(email)=LOWER($1)
         OR phone=$2
      `,
      [email.trim(), phone.trim()]
    );

    if (existing.length) {
      return res.status(400).json({
        success: false,
        message: "Resident already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      `
      INSERT INTO users (
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
        otp_verified,
        is_active
      )
      VALUES (
        $1,$2,$3,$4,
        'resident',
        $5,$6,$7,$8,$9,$10,
        'pending',
        FALSE,
        TRUE
      )
      RETURNING id
      `,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        hashedPassword,
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
      userId: rows[0].id,
    });
  } catch (err) {
    console.error("Register Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// Login
// =====================================

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and password are required.",
      });
    }

    const query = isEmail(login)
      ? "SELECT * FROM users WHERE LOWER(email)=LOWER($1)"
      : "SELECT * FROM users WHERE phone=$1";

    const { rows } = await db.query(query, [
      login.trim(),
    ]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const user = rows[0];
        if (user.approval_status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is awaiting admin approval.",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials.",
      });
    }

    if (!user.otp_verified) {
      const otp = generateOTP();
      const expiry = new Date(Date.now() + 10 * 60 * 1000);

      await db.query(
        `
        UPDATE users
        SET
          approval_otp = $1,
          otp_expires_at = $2
        WHERE id = $3
        `,
        [otp, expiry, user.id]
      );

      await sendOTPEmail(user.email, otp);

      return res.status(403).json({
        success: false,
        otpRequired: true,
        message: "OTP sent to your registered email.",
      });
    }

    const token = generateToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        resident_type: user.resident_type,
        flat_number: user.flat_number,
        approval_status: user.approval_status,
        otp_verified: user.otp_verified,
        profile_image: user.profile_image,
        emergency_contact: user.emergency_contact,
        occupation: user.occupation,
        date_of_birth: user.date_of_birth,
        anniversary_date: user.anniversary_date,
        is_active: user.is_active,
        canSwitchToAdmin: user.role === "admin",
      },
    });
  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// Verify OTP
// =====================================

exports.verifyOtp = async (req, res) => {
  try {
    const { login } = req.body;

    if (!login) {
      return res.status(400).json({
        success: false,
        message: "Email or phone is required.",
      });
    }

    const query = isEmail(login)
      ? "SELECT * FROM users WHERE LOWER(email)=LOWER($1)"
      : "SELECT * FROM users WHERE phone=$1";

    const { rows } = await db.query(query, [
      login.trim(),
    ]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const user = rows[0];

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      `
      UPDATE users
      SET
        approval_otp = $1,
        otp_expires_at = $2
      WHERE id = $3
      `,
      [otp, expiry, user.id]
    );

    await sendOTPEmail(user.email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// Verify OTP With Code
// =====================================

exports.verifyOtpWithCode = async (req, res) => {
  try {
    const { login, otp } = req.body;

    if (!login || !otp) {
      return res.status(400).json({
        success: false,
        message: "Login and OTP are required.",
      });
    }

    const query = isEmail(login)
      ? "SELECT * FROM users WHERE LOWER(email)=LOWER($1)"
      : "SELECT * FROM users WHERE phone=$1";

    const { rows } = await db.query(query, [
      login.trim(),
    ]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const user = rows[0];
    // ==============================
// Get Profile
// ==============================
exports.getProfile = async (req, res) => {
  try {
    const { rows } = await db.query(
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
        is_active,
        date_of_birth,
        anniversary_date,
        created_at
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
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
      emergency_contact,
      occupation,
      date_of_birth,
      anniversary_date,
      resident_type,
    } = req.body;

    await db.query(
      `
      UPDATE users
      SET
        name=$1,
        emergency_contact=$2,
        occupation=$3,
        date_of_birth=$4,
        anniversary_date=$5,
        resident_type=$6,
        updated_at=NOW()
      WHERE id=$7
      `,
      [
        name,
        emergency_contact || null,
        occupation || null,
        date_of_birth || null,
        anniversary_date || null,
        resident_type,
        req.user.id,
      ]
    );

    res.json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Change Password
// ==============================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const { rows } = await db.query(
      `SELECT password FROM users WHERE id=$1`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const valid = await bcrypt.compare(
      currentPassword,
      rows[0].password
    );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    await db.query(
      `
      UPDATE users
      SET password=$1,
          updated_at=NOW()
      WHERE id=$2
      `,
      [hashed, req.user.id]
    );

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
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
        message: "Invalid mode.",
      });
    }

    const { rows } = await db.query(
      `SELECT role FROM users WHERE id=$1`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (mode === "admin" && rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    res.json({
      success: true,
      mode,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Logout
// ==============================
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully.",
  });
};