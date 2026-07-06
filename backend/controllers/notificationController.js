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

    const [notifications] = await db.query(
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
      WHERE
        n.resident_id IS NULL
        OR n.resident_id = ?
      ORDER BY n.created_at DESC
      `,
      [residentId, residentId]
    );

    return res.status(200).json({
      success: true,
      notifications,
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
    const {
      title,
      message,
      type,
      resident_id,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required.",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO notifications
      (
        title,
        message,
        type,
        resident_id,
        created_by
      )
      VALUES (?, ?, ?, ?, ?)
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
      notificationId: result.insertId,
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

    const {
      title,
      message,
      type,
      resident_id,
    } = req.body;

    const [result] = await db.query(
      `
      UPDATE notifications
      SET
        title = ?,
        message = ?,
        type = ?,
        resident_id = ?
      WHERE id = ?
      `,
      [
        title,
        message,
        (type || "general").toLowerCase(),
        resident_id || null,
        id,
      ]
    );

    if (!result.affectedRows) {
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

    const [result] = await db.query(
      `
      DELETE FROM notifications
      WHERE id = ?
      `,
      [id]
    );

    if (!result.affectedRows) {
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
      INSERT IGNORE INTO notification_reads
      (
        notification_id,
        resident_id
      )
      VALUES (?, ?)
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
    const [[result]] = await db.query(
      `
      SELECT COUNT(*) AS unread
      FROM notifications n
      WHERE
        (n.resident_id IS NULL OR n.resident_id = ?)
      AND n.id NOT IN
      (
        SELECT notification_id
        FROM notification_reads
        WHERE resident_id = ?
      )
      `,
      [
        req.user.id,
        req.user.id,
      ]
    );

    return res.status(200).json({
      success: true,
      unread: result.unread,
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