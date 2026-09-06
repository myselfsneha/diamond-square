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

    const existingProfile = await db.query(
      `
      SELECT id
      FROM resident_profiles
      WHERE user_id = $1
      `,
      [userId]
    );

    if (existingProfile.rows.length) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists.",
      });
    }

    const flatResult = await db.query(
      `
      SELECT id
      FROM flats
      WHERE id = $1
      `,
      [flat_id]
    );

    if (!flatResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Flat not found.",
      });
    }

    const result = await db.query(
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
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
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

    await db.query(
      `
      UPDATE users
      SET
        resident_type = $1,
        emergency_contact = $2,
        date_of_birth = $3,
        anniversary_date = $4
      WHERE id = $5
      `,
      [
        resident_type,
        emergency_contact || null,
        birthday || null,
        anniversary || null,
        userId,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      profileId: result.rows[0].id,
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
    const result = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.profile_image,
        u.flat_number,
        u.approval_status,
        u.date_of_birth,
        u.anniversary_date,
        u.resident_type,
        u.emergency_contact,
        rp.flat_id,
        rp.birthday,
        rp.anniversary,
        f.flat_number AS flat_name
      FROM users u
      LEFT JOIN resident_profiles rp
        ON u.id = rp.user_id
      LEFT JOIN flats f
        ON rp.flat_id = f.id
      WHERE u.id = $1
      `,
      [req.user.id]
    );

    const profile = result.rows[0];

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      resident_type,
      birthday,
      anniversary,
      emergency_contact,
    } = req.body;

    const userId = req.user.id;

    await db.query(
      `
      UPDATE users
      SET
        name = $1,
        email = $2,
        phone = $3,
        resident_type = $4,
        emergency_contact = $5,
        date_of_birth = $6,
        anniversary_date = $7
      WHERE id = $8
      `,
      [
        name,
        email,
        phone,
        resident_type,
        emergency_contact || null,
        birthday || null,
        anniversary || null,
        userId,
      ]
    );

    await db.query(
      `
      UPDATE resident_profiles
      SET
        resident_type = $1,
        birthday = $2,
        anniversary = $3,
        emergency_contact = $4
      WHERE user_id = $5
      `,
      [
        resident_type,
        birthday || null,
        anniversary || null,
        emergency_contact || null,
        userId,
      ]
    );

    const result = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.profile_image,
        u.flat_number,
        u.approval_status,
        u.date_of_birth,
        u.anniversary_date,
        u.resident_type,
        u.emergency_contact,
        rp.flat_id,
        rp.birthday,
        rp.anniversary,
        f.flat_number AS flat_name
      FROM users u
      LEFT JOIN resident_profiles rp
        ON u.id = rp.user_id
      LEFT JOIN flats f
        ON rp.flat_id = f.id
      WHERE u.id = $1
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: result.rows[0],
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

    const result = await db.query(
      `
      DELETE FROM resident_profiles
      WHERE user_id = $1
      `,
      [userId]
    );

    if (result.rowCount === 0) {
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