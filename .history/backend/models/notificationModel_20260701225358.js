// ===========================================================
// Notification Model
// File: models/notificationModel.js
//
// Description:
// Handles all database operations for the Notification Module.
//
// Features:
// ✔ Get all notifications
// ✔ Get notification by ID
// ✔ Create notification
// ✔ Update notification
// ✔ Delete notification
// ✔ Resident notifications
// ✔ Mark notification as read
// ✔ Mark all notifications as read
// ✔ Unread notification count
// ✔ Search notifications
// ✔ Future-ready for Birthday & Anniversary notifications
// ===========================================================

const db = require("../config/db");

/**
 * ===========================================================
 * Get All Notifications
 * -----------------------------------------------------------
 * Returns every notification ordered by newest first.
 * ===========================================================
 */
exports.getAllNotifications = async () => {

  const [rows] = await db.query(`
    SELECT
      n.*,
      r.name AS created_by_name
    FROM notifications n
    LEFT JOIN residents r
      ON n.created_by = r.id
    ORDER BY
      n.created_at DESC
  `);

  return rows;
};

/**
 * ===========================================================
 * Get Notification By ID
 * -----------------------------------------------------------
 * Returns a single notification.
 * ===========================================================
 */
exports.getNotificationById = async (id) => {

  const [rows] = await db.query(
    `
    SELECT *
    FROM notifications
    WHERE id = ?
    `,
    [id]
  );

  return rows.length ? rows[0] : null;
};

/**
 * ===========================================================
 * Create Notification
 * -----------------------------------------------------------
 * Inserts a new notification.
 * ===========================================================
 */
exports.createNotification = async (data) => {

  const title = data.title?.trim();

  const message = data.message?.trim();

  const type = data.type || "General";

  const createdBy = data.created_by || null;

  const isActive = data.is_active ?? 1;

  const [result] = await db.query(
    `
    INSERT INTO notifications
    (
      title,
      message,
      type,
      created_by,
      is_active
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      title,
      message,
      type,
      createdBy,
      isActive
    ]
  );

  return result.insertId;
};

/**
 * ===========================================================
 * Update Notification
 * -----------------------------------------------------------
 * Updates an existing notification.
 * ===========================================================
 */
exports.updateNotification = async (id, data) => {

  const title = data.title?.trim();

  const message = data.message?.trim();

  const type = data.type;

  const isActive = data.is_active;

  await db.query(
    `
    UPDATE notifications
    SET
      title = ?,
      message = ?,
      type = ?,
      is_active = ?
    WHERE id = ?
    `,
    [
      title,
      message,
      type,
      isActive,
      id
    ]
  );
};

/**
 * ===========================================================
 * Delete Notification
 * -----------------------------------------------------------
 * Permanently removes a notification.
 * ===========================================================
 */
exports.deleteNotification = async (id) => {

  await db.query(
    `
    DELETE FROM notifications
    WHERE id = ?
    `,
    [id]
  );
};

/**
 * ===========================================================
 * Get Notifications For Resident
 * -----------------------------------------------------------
 * Returns all active notifications for a resident along
 * with read/unread status.
 * ===========================================================
 */
exports.getResidentNotifications = async (residentId) => {

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
      ON n.id = nr.notification_id
      AND nr.resident_id = ?

    WHERE n.is_active = 1

    ORDER BY
      n.created_at DESC
    `,
    [residentId]
  );

  return rows;
};

/**
 * ===========================================================
 * Search Notifications
 * -----------------------------------------------------------
 * Searches notification title, message and type.
 * ===========================================================
 */
exports.searchNotifications = async (keyword) => {

  const search = `%${keyword}%`;

  const [rows] = await db.query(
    `
    SELECT *
    FROM notifications
    WHERE
      title LIKE ?
      OR message LIKE ?
      OR type LIKE ?
    ORDER BY
      created_at DESC
    `,
    [
      search,
      search,
      search
    ]
  );

  return rows;
};

/**
 * ===========================================================
 * Mark Notification As Read
 * -----------------------------------------------------------
 * Stores resident read status.
 * Duplicate entries are ignored.
 * ===========================================================
 */
exports.markAsRead = async (
  notificationId,
  residentId
) => {

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
      residentId
    ]
  );
};

/**
 * ===========================================================
 * Mark All Notifications As Read
 * -----------------------------------------------------------
 * Marks every active notification as read for
 * the logged-in resident.
 * ===========================================================
 */
exports.markAllAsRead = async (residentId) => {

  const [notifications] = await db.query(
    `
    SELECT id
    FROM notifications
    WHERE is_active = 1
    `
  );

  for (const notification of notifications) {

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
        notification.id,
        residentId
      ]
    );

  }
};

/**
 * ===========================================================
 * Get Unread Notification Count
 * -----------------------------------------------------------
 * Returns total unread notifications for a resident.
 * ===========================================================
 */
exports.getUnreadCount = async (residentId) => {

  const [rows] = await db.query(
    `
    SELECT
      COUNT(*) AS unreadCount
    FROM notifications n

    LEFT JOIN notification_reads nr
      ON n.id = nr.notification_id
      AND nr.resident_id = ?

    WHERE
      nr.id IS NULL
      AND n.is_active = 1
    `,
    [residentId]
  );

  return rows[0]?.unreadCount || 0;
};

/**
 * ===========================================================
 * Create Birthday Notification
 * -----------------------------------------------------------
 * Creates a birthday notification that can later be shown
 * to all residents.
 * ===========================================================
 */
exports.createBirthdayNotification = async ({
  residentId,
  title,
  message,
  createdBy = null
}) => {

  const [result] = await db.query(
    `
    INSERT INTO notifications
    (
      title,
      message,
      type,
      created_by,
      resident_id,
      is_active
    )
    VALUES
    (
      ?,
      ?,
      'Birthday',
      ?,
      ?,
      1
    )
    `,
    [
      title.trim(),
      message.trim(),
      createdBy,
      residentId
    ]
  );

  return result.insertId;
};

/**
 * ===========================================================
 * Create Anniversary Notification
 * -----------------------------------------------------------
 * Creates an anniversary notification.
 * ===========================================================
 */
exports.createAnniversaryNotification = async ({
  residentId,
  title,
  message,
  createdBy = null
}) => {

  const [result] = await db.query(
    `
    INSERT INTO notifications
    (
      title,
      message,
      type,
      created_by,
      resident_id,
      is_active
    )
    VALUES
    (
      ?,
      ?,
      'Anniversary',
      ?,
      ?,
      1
    )
    `,
    [
      title.trim(),
      message.trim(),
      createdBy,
      residentId
    ]
  );

  return result.insertId;
};

/**
 * ===========================================================
 * Create System Notification
 * -----------------------------------------------------------
 * Used for:
 * - Maintenance
 * - Complaint
 * - Visitor Pass
 * - Event
 * - Emergency
 * - Announcement
 * ===========================================================
 */
exports.createSystemNotification = async ({
  title,
  message,
  type = "General",
  createdBy = null
}) => {

  const [result] = await db.query(
    `
    INSERT INTO notifications
    (
      title,
      message,
      type,
      created_by,
      is_active
    )
    VALUES (?, ?, ?, ?, 1)
    `,
    [
      title.trim(),
      message.trim(),
      type,
      createdBy
    ]
  );

  return result.insertId;
};

/**
 * ===========================================================
 * Get Notifications By Type
 * -----------------------------------------------------------
 * Examples:
 * General
 * Maintenance
 * Complaint
 * Visitor
 * Event
 * Birthday
 * Anniversary
 * Emergency
 * ===========================================================
 */
exports.getNotificationsByType = async (type) => {

  const [rows] = await db.query(
    `
    SELECT *
    FROM notifications
    WHERE
      type = ?
      AND is_active = 1
    ORDER BY created_at DESC
    `,
    [type]
  );

  return rows;
};

/**
 * ===========================================================
 * Get Latest Notifications
 * -----------------------------------------------------------
 * Returns latest notifications for dashboard widgets.
 * ===========================================================
 */
exports.getLatestNotifications = async (limit = 10) => {

  const [rows] = await db.query(
    `
    SELECT *
    FROM notifications
    WHERE is_active = 1
    ORDER BY created_at DESC
    LIMIT ?
    `,
    [Number(limit)]
  );

  return rows;
};

/**
 * ===========================================================
 * Archive Notification
 * -----------------------------------------------------------
 * Soft delete by disabling notification.
 * ===========================================================
 */
exports.archiveNotification = async (id) => {

  await db.query(
    `
    UPDATE notifications
    SET is_active = 0
    WHERE id = ?
    `,
    [id]
  );
};

/**
 * ===========================================================
 * Restore Archived Notification
 * -----------------------------------------------------------
 * Makes an archived notification active again.
 * ===========================================================
 */
exports.restoreNotification = async (id) => {

  await db.query(
    `
    UPDATE notifications
    SET is_active = 1
    WHERE id = ?
    `,
    [id]
  );
};

/**
 * ===========================================================
 * Get Total Notification Count
 * -----------------------------------------------------------
 * Dashboard statistics.
 * ===========================================================
 */
exports.getNotificationCount = async () => {

  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM notifications
    `
  );

  return rows[0]?.total || 0;
};

/**
 * ===========================================================
 * Get Active Notification Count
 * -----------------------------------------------------------
 * Dashboard statistics.
 * ===========================================================
 */
exports.getActiveNotificationCount = async () => {

  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM notifications
    WHERE is_active = 1
    `
  );

  return rows[0]?.total || 0;
};

/**
 * ===========================================================
 * NOTE FOR FUTURE DEVELOPMENT
 * -----------------------------------------------------------
 * Planned enhancements:
 *
 * ✔ Push Notifications
 * ✔ Email Notifications
 * ✔ WhatsApp Notifications
 * ✔ Scheduled Notifications
 * ✔ Birthday Wishes Module
 * ✔ Anniversary Wishes Module
 * ✔ Resident Reactions
 * ✔ Notification Attachments
 * ✔ Notification Priority
 * ✔ Expiry Date
 * ✔ Notification Analytics
 * ===========================================================
 */