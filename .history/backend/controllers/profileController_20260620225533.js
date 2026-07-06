const db = require("../config/db");

// Create Resident Profile
exports.createProfile = (req, res) => {
  const {
    flat_id,
    resident_type,
    birthday,
    anniversary,
    emergency_contact
  } = req.body;

  const user_id = req.user.id;

  db.query(
    `INSERT INTO resident_profiles
    (user_id, flat_id, resident_type, birthday, anniversary, emergency_contact)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      flat_id,
      resident_type,
      birthday,
      anniversary,
      emergency_contact
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.status(201).json({
        message: "Profile created successfully"
      });
    }
  );
};

// Get My Profile
exports.getMyProfile = (req, res) => {
  db.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.phone,
      rp.resident_type,
      rp.birthday,
      rp.anniversary,
      rp.emergency_contact,
      f.flat_number
    FROM users u
    JOIN resident_profiles rp ON u.id = rp.user_id
    JOIN flats f ON rp.flat_id = f.id
    WHERE u.id = ?
    `,
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json(results[0]);
    }
  );
};