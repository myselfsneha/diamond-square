const db = require("../config/db");

// Get Society Settings
exports.getSettings = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM society_settings LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Settings not found",
      });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Society Settings
exports.updateSettings = async (req, res) => {
  try {
    const {
      society_name,
      address,
      city,
      state,
      pincode,
      contact_email,
      contact_phone,
      maintenance_due_day,
      late_fee,
      visitor_approval_required,
      complaint_auto_close_days,
    } = req.body;

    await db.query(
      `
      UPDATE society_settings
      SET
        society_name = ?,
        address = ?,
        city = ?,
        state = ?,
        pincode = ?,
        contact_email = ?,
        contact_phone = ?,
        maintenance_due_day = ?,
        late_fee = ?,
        visitor_approval_required = ?,
        complaint_auto_close_days = ?
      WHERE id = 1
      `,
      [
        society_name,
        address,
        city,
        state,
        pincode,
        contact_email,
        contact_phone,
        maintenance_due_day,
        late_fee,
        visitor_approval_required,
        complaint_auto_close_days,
      ]
    );

    res.json({
      message: "Society settings updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};