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
      `
      SELECT *
      FROM users
      WHERE phone = ?
      `,
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
      flat_number: user.flat_number,
      approval_status: user.approval_status,
      profile_completed: user.profile_completed,
      profile_image: user.profile_image,
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
        flat_number,
        profile_image,
        approval_status,
        profile_completed,
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

    return res.json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      flat_number,
      date_of_birth,
      anniversary_date,
    } = req.body;

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        email = ?,
        phone = ?,
        flat_number = ?,
        date_of_birth = ?,
        anniversary_date = ?,
        profile_completed = 1
      WHERE id = ?
      `,
      [
        name?.trim(),
        email?.trim().toLowerCase(),
        phone?.trim(),
        flat_number?.trim(),
        date_of_birth || null,
        anniversary_date || null,
        req.user.id,
      ]
    );

    return res.json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};