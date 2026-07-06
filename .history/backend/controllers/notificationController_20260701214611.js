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

/*
==================================================
DELETE NOTIFICATION
DELETE /api/notifications/:id
==================================================
*/
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      `DELETE FROM notifications WHERE id = ?`,
      [id]
    );

    res.json({
      message: "Notification deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete notification.",
    });
  }
};

/*
==================================================
MARK NOTIFICATION AS READ
POST /api/notifications/read/:notificationId
==================================================
*/
exports.markAsRead = async (req, res) => {
  const { notificationId } = req.params;
  const residentId = req.user.id;

  try {
    await db.query(
      `
      INSERT IGNORE INTO notification_reads
      (
        notification_id,
        resident_id
      )
      VALUES (?, ?)
      `,
      [notificationId, residentId]
    );

    res.json({
      message: "Notification marked as read.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to mark notification as read.",
    });
  }
};

/*
==================================================
GET UNREAD COUNT
GET /api/notifications/unread
==================================================
*/
exports.getUnreadCount = async (req, res) => {
  const residentId = req.user.id;

  try {
    const [rows] = await db.query(
      `
      SELECT COUNT(*) AS unread

      FROM notifications n

      WHERE n.is_active = 1
      AND n.id NOT IN
      (
        SELECT notification_id
        FROM notification_reads
        WHERE resident_id = ?
      )
      `,
      [residentId]
    );

    res.json({
      unread: rows[0].unread,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch unread count.",
    });
  }
};

/*
==================================================
GET SINGLE NOTIFICATION
GET /api/notifications/:id
==================================================
*/
exports.getNotificationById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT *
      FROM notifications
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch notification.",
    });
  }
};