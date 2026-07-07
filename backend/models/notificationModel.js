const db = require("../config/db");

exports.getAllNotifications = async () => {
  const result = await db.query(`
    SELECT
      n.*,
      u.name AS created_by_name
    FROM notifications n
    LEFT JOIN users u
      ON n.created_by = u.id
    ORDER BY n.created_at DESC
  `);

  return result.rows;
};

exports.getNotificationById = async (id) => {
  const result = await db.query(
    `
    SELECT *
    FROM notifications
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
};

exports.createNotification = async (data) => {
  const result = await db.query(
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
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
    `,
    [
      data.title?.trim(),
      data.message?.trim(),
      data.type || "General",
      data.created_by || null,
      data.resident_id || null,
      data.is_active ?? true,
    ]
  );

  return result.rows[0].id;
};

exports.updateNotification = async (id, data) => {
  await db.query(
    `
    UPDATE notifications
    SET
      title = $1,
      message = $2,
      type = $3,
      is_active = $4
    WHERE id = $5
    `,
    [
      data.title?.trim(),
      data.message?.trim(),
      data.type,
      data.is_active,
      id,
    ]
  );
};

exports.deleteNotification = async (id) => {
  await db.query(
    `
    DELETE FROM notifications
    WHERE id = $1
    `,
    [id]
  );
};

exports.archiveNotification = async (id) => {
  await db.query(
    `
    UPDATE notifications
    SET is_active = FALSE
    WHERE id = $1
    `,
    [id]
  );
};

exports.restoreNotification = async (id) => {
  await db.query(
    `
    UPDATE notifications
    SET is_active = TRUE
    WHERE id = $1
    `,
    [id]
  );
};

exports.getResidentNotifications = async (residentId) => {
  const result = await db.query(
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
      AND nr.resident_id = $1
    WHERE
      n.is_active = TRUE
      AND (
        n.resident_id IS NULL
        OR n.resident_id = $2
      )
    ORDER BY n.created_at DESC
    `,
    [residentId, residentId]
  );

  return result.rows;
};

exports.markAsRead = async (notificationId, residentId) => {
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
    [notificationId, residentId]
  );
};

exports.markAllAsRead = async (residentId) => {
  await db.query(
    `
    INSERT INTO notification_reads
    (
      notification_id,
      resident_id
    )
    SELECT
      id,
      $1
    FROM notifications
    WHERE is_active = TRUE
    ON CONFLICT (notification_id, resident_id)
    DO NOTHING
    `,
    [residentId]
  );
};

exports.getUnreadCount = async (residentId) => {
  const result = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM notifications n
    LEFT JOIN notification_reads nr
      ON n.id = nr.notification_id
      AND nr.resident_id = $1
    WHERE
      nr.id IS NULL
      AND n.is_active = TRUE
      AND (
        n.resident_id IS NULL
        OR n.resident_id = $2
      )
    `,
    [residentId, residentId]
  );

  return Number(result.rows[0].total);
};

exports.searchNotifications = async (keyword) => {
  const search = `%${keyword}%`;

  const result = await db.query(
    `
    SELECT *
    FROM notifications
    WHERE
      title ILIKE $1
      OR message ILIKE $2
      OR type ILIKE $3
    ORDER BY created_at DESC
    `,
    [search, search, search]
  );

  return result.rows;
};

exports.getNotificationsByType = async (type) => {
  const result = await db.query(
    `
    SELECT *
    FROM notifications
    WHERE
      type = $1
      AND is_active = TRUE
    ORDER BY created_at DESC
    `,
    [type]
  );

  return result.rows;
};

exports.getLatestNotifications = async (limit = 10) => {
  const result = await db.query(
    `
    SELECT *
    FROM notifications
    WHERE is_active = TRUE
    ORDER BY created_at DESC
    LIMIT $1
    `,
    [Number(limit)]
  );

  return result.rows;
};

exports.createBirthdayNotification = async (
  residentId,
  title,
  message,
  createdBy = null
) => {
  const result = await db.query(
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
    VALUES ($1, $2, 'Birthday', $3, $4, TRUE)
    RETURNING id
    `,
    [
      title.trim(),
      message.trim(),
      createdBy,
      residentId,
    ]
  );

  return result.rows[0].id;
};

exports.createAnniversaryNotification = async (
  residentId,
  title,
  message,
  createdBy = null
) => {
  const result = await db.query(
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
    VALUES ($1, $2, 'Anniversary', $3, $4, TRUE)
    RETURNING id
    `,
    [
      title.trim(),
      message.trim(),
      createdBy,
      residentId,
    ]
  );

  return result.rows[0].id;
};

exports.createSystemNotification = async (
  title,
  message,
  type = "General",
  createdBy = null
) => {
  const result = await db.query(
    `
    INSERT INTO notifications
    (
      title,
      message,
      type,
      created_by,
      is_active
    )
    VALUES ($1, $2, $3, $4, TRUE)
    RETURNING id
    `,
    [
      title.trim(),
      message.trim(),
      type,
      createdBy,
    ]
  );

  return result.rows[0].id;
};

exports.getNotificationCount = async () => {
  const result = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM notifications
    `
  );

  return Number(result.rows[0].total);
};

exports.getActiveNotificationCount = async () => {
  const result = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM notifications
    WHERE is_active = TRUE
    `
  );

  return Number(result.rows[0].total);
};