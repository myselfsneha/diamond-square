const db = require("../config/db");

exports.getSettings = async (req, res) => {
  try {
    const [[settings]] = await db.query(
      `
      SELECT *
      FROM society_settings
      LIMIT 1
      `
    );

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Society settings not found.",
      });
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

    const [[settings]] = await db.query(
      `
      SELECT id
      FROM society_settings
      LIMIT 1
      `
    );

    if (!settings) {
      await db.query(
        `
        INSERT INTO society_settings
        (
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
          complaint_auto_close_days
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

            return res.status(201).json({
        success: true,
        message: "Society settings created successfully.",
      });
    }

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
      WHERE id = ?
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
        settings.id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Society settings updated successfully.",
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};