const db = require("../config/db");

exports.getAllNotifications = async () => {
  const [rows] = await db.query(`
    SELECT
      n.*,
      u.name AS created_by_name
    FROM notifications n
    LEFT JOIN users u
      ON n.created_by = u.id
    ORDER BY n.created_at DESC
  `);

  return rows;
};

exports.getNotificationById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM notifications
    WHERE id = ?
    `,
    [id]
  );

  return rows[0] || null;
};

exports.createNotification = async (data) => {
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
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      data.title?.trim(),
      data.message?.trim(),
      data.type || "General",
      data.created_by || null,
      data.resident_id || null,
      data.is_active ?? 1
    ]
  );

  return result.insertId;
};

exports.updateNotification = async (id, data) => {
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
      data.title?.trim(),
      data.message?.trim(),
      data.type,
      data.is_active,
      id
    ]
  );
};

exports.deleteNotification = async (id) => {
  await db.query(
    `
    DELETE FROM notifications
    WHERE id = ?
    `,
    [id]
  );
};

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
    WHERE
      n.is_active = 1
      AND (
        n.resident_id IS NULL
        OR n.resident_id = ?
      )
    ORDER BY n.created_at DESC
    `,
    [residentId, residentId]
  );

  return rows;
};

exports.markAsRead = async (notificationId, residentId) => {
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
};

exports.markAllAsRead = async (residentId) => {
  const [notifications] = await db.query(
    `
    SELECT id
    FROM notifications
    WHERE is_active = 1
    `
  );

  for (const item of notifications) {
    await db.query(
      `
      INSERT IGNORE INTO notification_reads
      (
        notification_id,
        resident_id
      )
      VALUES (?, ?)
      `,
      [item.id, residentId]
    );
  }
};

exports.getUnreadCount = async (residentId) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM notifications n
    LEFT JOIN notification_reads nr
      ON n.id = nr.notification_id
      AND nr.resident_id = ?
    WHERE
      nr.id IS NULL
      AND n.is_active = 1
      AND (
        n.resident_id IS NULL
        OR n.resident_id = ?
      )
    `,
    [residentId, residentId]
  );

  return rows[0].total;
};

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
    ORDER BY created_at DESC
    `,
    [search, search, search]
  );

  return rows;
};

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

exports.createBirthdayNotification = async (residentId, title, message, createdBy = null) => {
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
    VALUES (?, ?, 'Birthday', ?, ?, 1)
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

exports.createAnniversaryNotification = async (residentId, title, message, createdBy = null) => {
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
    VALUES (?, ?, 'Anniversary', ?, ?, 1)
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

exports.createSystemNotification = async (
  title,
  message,
  type = "General",
  createdBy = null
) => {
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

exports.getNotificationCount = async () => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM notifications
    `
  );

  return rows[0].total;
};

exports.getActiveNotificationCount = async () => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM notifications
    WHERE is_active = 1
    `
  );

  return rows[0].total;
};