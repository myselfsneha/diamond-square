const db = require("../config/db");

/*
==================================================
GET ALL NOTIFICATIONS (Admin)
GET /api/notifications
==================================================
*/
exports.getNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        n.*,
        u.name AS created_by_name
      FROM notifications n
      LEFT JOIN users u
        ON n.created_by = u.id
      ORDER BY n.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch notifications.",
    });
  }
};

/*
==================================================
GET ACTIVE NOTIFICATIONS (Resident)
GET /api/notifications/resident/:residentId
==================================================
*/
exports.getResidentNotifications = async (req, res) => {
  const { residentId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT
        n.*,
        CASE
          WHEN nr.id IS NULL THEN 0
          ELSE 1
        END AS is_read
      FROM notifications n

      LEFT JOIN notification_reads nr
        ON nr.notification_id = n.id
        AND nr.resident_id = ?

      WHERE n.is_active = 1

      ORDER BY n.created_at DESC
      `,
      [residentId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch notifications.",
    });
  }
};

/*
==================================================
CREATE NOTIFICATION
POST /api/notifications
==================================================
*/
exports.createNotification = async (req, res) => {
  const {
    title,
    message,
    type,
    is_active,
  } = req.body;

  try {
    await db.query(
      `
      INSERT INTO notifications
      (
        title,
        message,
        type,
        is_active,
        created_by
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        title,
        message,
        type || "General",
        is_active ?? 1,
        req.user.id,
      ]
    );

    res.json({
      message: "Notification created successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create notification.",
    });
  }
};

/*
==================================================
UPDATE NOTIFICATION
PUT /api/notifications/:id
==================================================
*/
exports.updateNotification = async (req, res) => {
  const { id } = req.params;

  const {
    title,
    message,
    type,
    is_active,
  } = req.body;

  try {
    await db.query(
      `
      UPDATE notifications
      SET
        title=?,
        message=?,
        type=?,
        is_active=?
      WHERE id=?
      `,
      [
        title,
        message,
        type,
        is_active,
        id,
      ]
    );

    res.json({
      message: "Notification updated successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update notification.",
    });
  }
};