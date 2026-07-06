const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      flat_number,
      date_of_birth,
      anniversary_date,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !role ||
      !flat_number ||
      !date_of_birth
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (!["owner", "tenant"].includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Role must be Owner or Tenant.",
      });
    }

    const [existingUsers] = await db.query(
      `
      SELECT id
      FROM users
      WHERE email = ? OR phone = ?
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

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const [result] = await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        phone,
        password,
        role,
        flat_number,
        date_of_birth,
        anniversary_date,
        approval_status,
        profile_completed,
        is_active
      )
      VALUES
      (
        ?, ?, ?, ?, ?, ?, ?, ?,
        'pending',
        0,
        1
      )
      `,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        hashedPassword,
        role.toLowerCase(),
        flat_number.trim(),
        date_of_birth || null,
        anniversary_date || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Your account is awaiting admin approval.",
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