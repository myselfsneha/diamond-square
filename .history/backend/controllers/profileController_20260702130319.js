const db = require("../config/db");

exports.createProfile = async (req, res) => {
  try {
    const {
      flat_id,
      resident_type,
      birthday,
      anniversary,
      emergency_contact,
    } = req.body;

    const userId = req.user.id;

    if (!flat_id || !resident_type) {
      return res.status(400).json({
        success: false,
        message: "Flat ID and resident type are required.",
      });
    }

    const [existingProfile] = await db.query(
      `
      SELECT id
      FROM resident_profiles
      WHERE user_id = ?
      `,
      [userId]
    );

    if (existingProfile.length) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists.",
      });
    }

    const [[flat]] = await db.query(
      `
      SELECT id
      FROM flats
      WHERE id = ?
      `,
      [flat_id]
    );

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found.",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO resident_profiles
      (
        user_id,
        flat_id,
        resident_type,
        birthday,
        anniversary,
        emergency_contact
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        flat_id,
        resident_type,
        birthday || null,
        anniversary || null,
        emergency_contact || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      profileId: result.insertId,
    });
  } catch (error) {
    console.error("Create Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const [[profile]] = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.profile_image,
        u.flat_number,
        u.approval_status,
        rp.flat_id,
        rp.resident_type,
        rp.birthday,
        rp.anniversary,
        rp.emergency_contact,
        f.flat_number AS flat_name
      FROM users u
      LEFT JOIN resident_profiles rp
        ON u.id = rp.user_id
      LEFT JOIN flats f
        ON rp.flat_id = f.id
      WHERE u.id = ?
      `,
      [req.user.id]
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      flat_id,
      resident_type,
      birthday,
      anniversary,
      emergency_contact,
    } = req.body;

    const userId = req.user.id;

    const [[profile]] = await db.query(
      `
      SELECT id
      FROM resident_profiles
      WHERE user_id = ?
      `,
      [userId]
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    if (flat_id) {
      const [[flat]] = await db.query(
        `
        SELECT id
        FROM flats
        WHERE id = ?
        `,
        [flat_id]
      );

      if (!flat) {
        return res.status(404).json({
          success: false,
          message: "Flat not found.",
        });
      }
    }

    await db.query(
      `
      UPDATE resident_profiles
      SET
        flat_id = ?,
        resident_type = ?,
        birthday = ?,
        anniversary = ?,
        emergency_contact = ?
      WHERE user_id = ?
      `,
      [
        flat_id,
        resident_type,
        birthday || null,
        anniversary || null,
        emergency_contact || null,
        userId,
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

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [result] = await db.query(
      `
      DELETE FROM resident_profiles
      WHERE user_id = ?
      `,
      [userId]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};