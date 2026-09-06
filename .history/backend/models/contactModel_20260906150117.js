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
  const result = await db.query(
    `
    SELECT *
    FROM important_contacts
    ORDER BY
      ${categoryOrder},
      name ASC
    `
  );

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
