const db = require("../config/db");

// Create Resident Profile
exports.createProfile = async (req, res) => {
  try {
    const {
      flat_id,
      resident_type,
      birthday,
      anniversary,
      emergency_contact,
    } = req.body;

    const user_id = req.user.id;

    if (!flat_id || !resident_type) {
      return res.status(400).json({
        message:
          "Flat ID and resident type are required",
      });
    }

    // Check if profile already exists
    const [existingProfile] = await db.query(
      `SELECT id
       FROM resident_profiles
       WHERE user_id = ?`,
      [user_id]
    );

    if (existingProfile.length > 0) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    // Check flat exists
    const [flat] = await db.query(
      "SELECT id FROM flats WHERE id = ?",
      [flat_id]
    );

    if (flat.length === 0) {
      return res.status(404).json({
        message: "Flat not found",
      });
    }

    const [result] = await db.query(
      `INSERT INTO resident_profiles
      (
        user_id,
        flat_id,
        resident_type,
        birthday,
        anniversary,
        emergency_contact
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        flat_id,
        resident_type,
        birthday || null,
        anniversary || null,
        emergency_contact || null,
      ]
    );

    res.status(201).json({
      message: "Profile created successfully",
      profileId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Profile
exports.getMyProfile = async (req, res) => {
  try {
    const [results] = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        rp.flat_id,
        rp.resident_type,
        rp.birthday,
        rp.anniversary,
        rp.emergency_contact,
        f.flat_number
      FROM users u
      JOIN resident_profiles rp
        ON u.id = rp.user_id
      LEFT JOIN flats f
        ON rp.flat_id = f.id
      WHERE u.id = ?
      `,
      [req.user.id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(results[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};