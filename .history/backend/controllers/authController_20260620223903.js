const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");

// Register Resident
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    db.query(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [email, phone],
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            message: err.message
          });
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "User already exists"
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO users (name, email, phone, password)
           VALUES (?, ?, ?, ?)`,
          [name, email, phone, hashedPassword],
          (err) => {
            if (err) {
              return res.status(500).json({
                message: err.message
              });
            }

            res.status(201).json({
              message: "Registration successful"
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Login
exports.login = (req, res) => {
  const { phone, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE phone = ?",
    [phone],
    async (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid password"
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
          role: user.role
        }
      });
    }
  );
};