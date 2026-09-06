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