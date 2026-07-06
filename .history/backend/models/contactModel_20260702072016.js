const db = require("../config/db");

exports.getAllContacts = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM important_contacts
    ORDER BY
      FIELD(
        category,
        'Committee',
        'Security',
        'Emergency',
        'Maintenance',
        'Electrician',
        'Plumber',
        'Lift Service',
        'Housekeeping',
        'Water Supplier',
        'Gas Agency',
        'Other'
      ),
      name ASC
  `);

  return rows;
};

exports.getContactById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM important_contacts
    WHERE id = ?
    `,
    [id]
  );

  return rows[0] || null;
};

exports.createContact = async (data) => {
  const name = data.name?.trim();
  const designation = data.designation?.trim();
  const phone = data.phone?.trim();
  const category = data.category?.trim();

  const [result] = await db.query(
    `
    INSERT INTO important_contacts
    (
      name,
      designation,
      phone,
      category
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      name,
      designation,
      phone,
      category
    ]
  );

  return result.insertId;
};

exports.updateContact = async (id, data) => {
  const name = data.name?.trim();
  const designation = data.designation?.trim();
  const phone = data.phone?.trim();
  const category = data.category?.trim();

  await db.query(
    `
    UPDATE important_contacts
    SET
      name = ?,
      designation = ?,
      phone = ?,
      category = ?
    WHERE id = ?
    `,
    [
      name,
      designation,
      phone,
      category,
      id
    ]
  );
};

exports.deleteContact = async (id) => {
  await db.query(
    `
    DELETE FROM important_contacts
    WHERE id = ?
    `,
    [id]
  );
};

exports.searchContacts = async (keyword) => {
  const search = `%${keyword}%`;

  const [rows] = await db.query(
    `
    SELECT *
    FROM important_contacts
    WHERE
      name LIKE ?
      OR designation LIKE ?
      OR category LIKE ?
      OR phone LIKE ?
    ORDER BY
      FIELD(
        category,
        'Committee',
        'Security',
        'Emergency',
        'Maintenance',
        'Electrician',
        'Plumber',
        'Lift Service',
        'Housekeeping',
        'Water Supplier',
        'Gas Agency',
        'Other'
      ),
      name ASC
    `,
    [
      search,
      search,
      search,
      search
    ]
  );

  return rows;
};

exports.getContactsByCategory = async (category) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM important_contacts
    WHERE category = ?
    ORDER BY name ASC
    `,
    [category]
  );

  return rows;
};

exports.getContactCount = async () => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM important_contacts
    `
  );

  return rows[0].total;
};

exports.contactExists = async (phone) => {
  const [rows] = await db.query(
    `
    SELECT id
    FROM important_contacts
    WHERE phone = ?
    LIMIT 1
    `,
    [phone]
  );

  return rows.length > 0;
};