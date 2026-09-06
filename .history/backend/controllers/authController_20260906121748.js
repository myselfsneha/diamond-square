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

    const { rows: existingUsers } = await db.query(
      `SELECT id FROM users WHERE email = $1 OR phone = $2`,
      [email.trim().toLowerCase(), phone.trim()]
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
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
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
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password are required.",
      });
    }

    const { rows: users } = await db.query(
      "SELECT * FROM users WHERE phone = $1",
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
        message: "OTP sent to your email.",
      });
    }

    if (!user.is_active) {
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
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
