const db = require("../config/db");

const categoryOrder = `
CASE category::text
  WHEN 'committee' THEN 1
  WHEN 'emergency' THEN 2
  WHEN 'electrician' THEN 3
  WHEN 'plumber' THEN 4
  ELSE 5
END
`;

exports.getAllContacts = async () => {
  const result = await db.query(`
    SELECT *
    FROM important_contacts
    ORDER BY
      ${categoryOrder},
      name ASC
  `);

  return result.rows;
};

exports.getContactById = async (id) => {
  const result = await db.query(
    `
    SELECT *
    FROM important_contacts
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
};

exports.createContact = async (data) => {
  const name = data.name?.trim();
  const designation = data.designation?.trim();
  const phone = data.phone?.trim();
  const category = data.category?.trim();

  const result = await db.query(
    `
    INSERT INTO important_contacts
    (
      name,
      designation,
      phone,
      category
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `,
    [
      name,
      designation,
      phone,
      category,
    ]
  );

  return result.rows[0].id;
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
      name = $1,
      designation = $2,
      phone = $3,
      category = $4
    WHERE id = $5
    `,
    [
      name,
      designation,
      phone,
      category,
      id,
    ]
  );
};

exports.deleteContact = async (id) => {
  await db.query(
    `
    DELETE FROM important_contacts
    WHERE id = $1
    `,
    [id]
  );
};

exports.searchContacts = async (keyword) => {
  const search = `%${keyword}%`;

  const result = await db.query(
    `
    SELECT *
    FROM important_contacts
    WHERE
      name ILIKE $1
      OR designation ILIKE $2
      OR category ILIKE $3
      OR phone ILIKE $4
    ORDER BY
      ${categoryOrder},
      name ASC
    `,
    [
      search,
      search,
      search,
      search,
    ]
  );

  return result.rows;
};

exports.getContactsByCategory = async (category) => {
  const result = await db.query(
    `
    SELECT *
    FROM important_contacts
    WHERE category = $1
    ORDER BY name ASC
    `,
    [category]
  );

  return result.rows;
};

exports.getContactCount = async () => {
  const result = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM important_contacts
    `
  );

  return Number(result.rows[0].total);
};

exports.contactExists = async (phone) => {
  const result = await db.query(
    `
    SELECT id
    FROM important_contacts
    WHERE phone = $1
    LIMIT 1
    `,
    [phone]
  );

  return result.rows.length > 0;
};