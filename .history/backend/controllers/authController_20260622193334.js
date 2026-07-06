const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");

// Register Resident
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const [insertResult] = await db.query(
      `INSERT INTO users
      (name, email, phone, password)
      VALUES (?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        hashedPassword,
      ]
    );

    res.status(201).json({
      message:
        "Registration successful. Awaiting admin approval.",
      userId: insertResult.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone and password are required",
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE phone = ?",
      [phone]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = users[0];

    if (
      user.approval_status &&
      user.approval_status !== "approved"
    ) {
      return res.status(403).json({
        message:
          "Your account is pending admin approval",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(
      user.id,
      user.role
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        approval_status:
          user.approval_status,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};