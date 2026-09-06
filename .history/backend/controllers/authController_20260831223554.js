const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");
const sendOTPEmail = require("../utils/sendOTPEmail");

// ==============================
// Helper - Generate OTP
// ==============================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==============================
// Register
// ==============================
// <-- Keep your existing register function exactly as it is -->

// ==============================
// Login
// ==============================
exports.login = async (req, res) => {
  console.log("========== LOGIN REQUEST ==========");
  console.log("Headers:", req.headers["content-type"]);
  console.log("Body:", req.body);

  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and password are required.",
      });
    }

    const value = login.trim().toLowerCase();

    const { rows: users } = await db.query(
      `
      SELECT *
      FROM users
      WHERE LOWER(email) = $1
         OR phone = $2
      LIMIT 1
      `,
      [value, login.trim()]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const user = users[0];

    // Admin approval check
    if (user.approval_status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is awaiting admin approval.",
      });
    }

    // Account active check
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Your account has been temporarily suspended.",
      });
    }

    // Password check
    const passwordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/mobile or password.",
      });
    }

    // First login OTP verification
    if (!user.otp_verified) {
      const otp = generateOTP();
      const expiry = new Date(Date.now() + 10 * 60 * 1000);

      await db.query(
        `
        UPDATE users
        SET approval_otp = $1,
            otp_expires_at = $2
        WHERE id = $3
        `,
        [otp, expiry, user.id]
      );

      await sendOTPEmail(user.email, otp);

      return res.status(403).json({
        success: false,
        otpRequired: true,
        message: "OTP sent to your email.",
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

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Verify OTP (Legacy)
// ==============================
exports.verifyOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    const { rows: users } = await db.query(
      `SELECT * FROM users WHERE phone = $1`,
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

    await db.query(
      `
      UPDATE users
      SET
        otp_verified = TRUE,
        approval_otp = NULL,
        otp_expires_at = NULL
      WHERE id = $1
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
        approval_status: user.approval_status,
        otp_verified: true,
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
// Verify OTP With Code
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

    const { rows } = await db.query(
      `SELECT * FROM users WHERE phone = $1`,
      [phone.trim()]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const user = rows[0];

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
        otp_verified = TRUE,
        approval_otp = NULL,
        otp_expires_at = NULL
      WHERE id = $1
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
        approval_status: user.approval_status,
        otp_verified: true,
        is_active: user.is_active,
      },
    });

  } catch (error) {
    console.error("Verify OTP With Code Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Profile
// ==============================
