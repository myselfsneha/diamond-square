const db = require("../config/db");

exports.getNotifications = async (req, res) => {
  try {
    const [notifications] = await db.query(`
      SELECT
        n.*,
        u.name AS created_by_name
      FROM notifications n
      LEFT JOIN users u
        ON n.created_by = u.id
      ORDER BY n.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getResidentNotifications = async (req, res) => {
  try {
    const residentId = req.user.id;

    const result = await db.query(
      `
      SELECT
        n.*,
        CASE
          WHEN nr.id IS NULL THEN false
          ELSE true
        END AS is_read
      FROM notifications n
      LEFT JOIN notification_reads nr
        ON nr.notification_id = n.id
       AND nr.resident_id = $1
      WHERE
        n.resident_id IS NULL
        OR n.resident_id = $2
      ORDER BY n.created_at DESC
      `,
      [residentId, residentId]
    );

    return res.status(200).json({
      success: true,
      notifications: result.rows,
    });
  } catch (error) {
    console.error("Resident Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, resident_id } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required.",
      });
    }

    const result = await db.query(
      `
      INSERT INTO notifications
      (
        title,
        message,
        type,
        resident_id,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        title.trim(),
        message.trim(),
        (type || "general").toLowerCase(),
        resident_id || null,
        req.user.id,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Notification created successfully.",
      notificationId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Create Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, type, resident_id } = req.body;

    const result = await db.query(
      `
      UPDATE notifications
      SET
        title = $1,
        message = $2,
        type = $3,
        resident_id = $4
      WHERE id = $5
      `,
      [
        title,
        message,
        (type || "general").toLowerCase(),
        resident_id || null,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification updated successfully.",
    });
  } catch (error) {
    console.error("Update Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM notifications
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await db.query(
      `
      INSERT INTO notification_reads
      (
        notification_id,
        resident_id
      )
      VALUES ($1, $2)
      ON CONFLICT (notification_id, resident_id)
      DO NOTHING
      `,
      [
        notificationId,
        req.user.id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
    });
  } catch (error) {
    console.error("Mark Notification Read Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT COUNT(*) AS unread
      FROM notifications n
      WHERE
        (n.resident_id IS NULL OR n.resident_id = $1)
      AND n.id NOT IN
      (
        SELECT notification_id
        FROM notification_reads
        WHERE resident_id = $2
      )
      `,
      [req.user.id, req.user.id]
    );

    return res.status(200).json({
      success: true,
      unread: Number(result.rows[0].unread),
    });
  } catch (error) {
    console.error("Unread Count Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [notifications] = await db.query(
      `
      SELECT
        n.*,
        u.name AS created_by_name
      FROM notifications n
      LEFT JOIN users u
        ON n.created_by = u.id
      WHERE n.id = ?
      `,
      [id]
    );

    if (!notifications.length) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      notification: notifications[0],
    });
  } catch (error) {
    console.error("Get Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};