const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");
const sendOTPEmail = require("../utils/sendOTPEmail");

// ==============================
// Generate OTP
// ==============================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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

    if (
      !["owner", "tenant"].includes(
        resident_type.toLowerCase()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Resident type must be Owner or Tenant.",
      });
    }

    const { rows: existingUsers } = await db.query(
      `
      SELECT id
      FROM users
      WHERE LOWER(email) = $1
         OR phone = $2
      `,
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
        message:
          "Password must contain at least 8 characters.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

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
        approval_otp,
        otp_expires_at,
        otp_verified,
        is_active
      )
      VALUES (
        $1,$2,$3,$4,
        'resident',
        $5,$6,$7,$8,$9,$10,
        'pending',
        NULL,
        NULL,
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

    // Account approval
    if (user.approval_status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is awaiting admin approval.",
      });
    }

    // Account active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been temporarily suspended.",
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

    // First login OTP
    if (!user.otp_verified) {
      const otp = generateOTP();
      const expiry = new Date(
        Date.now() + 10 * 60 * 1000
      );

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
        otp_verified,
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

    return res.status(200).json({
      success: true,
      user: rows[0],
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
        name = $1,
        email = $2,
        phone = $3,
        resident_type = $4,
        flat_number = $5,
        emergency_contact = $6,
        occupation = $7,
        date_of_birth = $8,
        anniversary_date = $9
      WHERE id = $10
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