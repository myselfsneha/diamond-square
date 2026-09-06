const db = require("../config/db");

exports.getSettings = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM settings LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.json({
        society_name: "Diamond Square",
        contact_email: "admin@diamondsquare.com",
        maintenance_cycle: "Monthly",
      });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Get Settings Error:", err);

    return res.status(500).json({
      message: "Failed to load settings",
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const {
      society_name,
      contact_email,
      maintenance_cycle,
    } = req.body;

    const existing = await db.query(
      "SELECT id FROM settings LIMIT 1"
    );

    if (existing.rows.length === 0) {
      await db.query(
        `
        INSERT INTO settings
        (society_name, contact_email, maintenance_cycle)
        VALUES ($1, $2, $3)
        `,
        [
          society_name,
          contact_email,
          maintenance_cycle,
        ]
      );
    } else {
      await db.query(
        `
        UPDATE settings
        SET
          society_name = $1,
          contact_email = $2,
          maintenance_cycle = $3
        WHERE id = $4
        `,
        [
          society_name,
          contact_email,
          maintenance_cycle,
          existing.rows[0].id,
        ]
      );
    }

    return res.json({
      message: "Settings updated successfully",
    });
  } catch (err) {
    console.error("Update Settings Error:", err);

    return res.status(500).json({
      message: "Failed to update settings",
    });
  }
};