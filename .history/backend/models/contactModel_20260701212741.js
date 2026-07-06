const db = require("../config/db");

exports.getAllContacts = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM important_contacts
    ORDER BY
      FIELD(category,
        'Committee',
        'Security',
        'Emergency',
        'Maintenance',
        'Other'
      ),
      name ASC
  `);

  return rows;
};

exports.getContactById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM important_contacts WHERE id=?",
    [id]
  );

  return rows[0];
};

exports.createContact = async (data) => {
  const { name, designation, phone, category } = data;

  const [result] = await db.query(
    `
    INSERT INTO important_contacts
    (name, designation, phone, category)
    VALUES (?, ?, ?, ?)
    `,
    [name, designation, phone, category]
  );

  return result.insertId;
};

exports.updateContact = async (id, data) => {
  const { name, designation, phone, category } = data;

  await db.query(
    `
    UPDATE important_contacts
    SET
      name=?,
      designation=?,
      phone=?,
      category=?
    WHERE id=?
    `,
    [name, designation, phone, category, id]
  );
};

exports.deleteContact = async (id) => {
  await db.query(
    "DELETE FROM important_contacts WHERE id=?",
    [id]
  );
};