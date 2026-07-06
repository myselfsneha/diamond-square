// ======================================================
// Important Contacts Model
// File: models/importantContactModel.js
// Description:
// Handles all database operations related to Important
// Contacts used throughout the Diamond Square application.
//
// Features:
// ✔ Get all contacts
// ✔ Get contact by ID
// ✔ Create contact
// ✔ Update contact
// ✔ Delete contact
// ✔ Search contacts
// ✔ Trim incoming data
// ✔ Production-ready comments
// ======================================================

const db = require("../config/db");

/**
 * ------------------------------------------------------
 * Get All Contacts
 * ------------------------------------------------------
 * Returns every contact ordered by category and name.
 */
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

/**
 * ------------------------------------------------------
 * Get Contact By ID
 * ------------------------------------------------------
 * Returns a single contact.
 */
exports.getContactById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM important_contacts
    WHERE id = ?
    `,
    [id]
  );

  return rows.length ? rows[0] : null;
};

/**
 * ------------------------------------------------------
 * Create Contact
 * ------------------------------------------------------
 * Inserts a new important contact.
 */
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
    [name, designation, phone, category]
  );

  return result.insertId;
};

/**
 * ------------------------------------------------------
 * Update Contact
 * ------------------------------------------------------
 * Updates an existing contact.
 */
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

/**
 * ------------------------------------------------------
 * Delete Contact
 * ------------------------------------------------------
 * Removes a contact permanently.
 */
exports.deleteContact = async (id) => {
  await db.query(
    `
    DELETE FROM important_contacts
    WHERE id = ?
    `,
    [id]
  );
};

/**
 * ------------------------------------------------------
 * Search Contacts
 * ------------------------------------------------------
 * Used by frontend search bar.
 *
 * Searches:
 * - Name
 * - Designation
 * - Category
 */
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
    ORDER BY
      name ASC
    `,
    [
      search,
      search,
      search
    ]
  );

  return rows;
};