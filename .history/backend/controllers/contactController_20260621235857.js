const db = require("../config/db");

// Get All Contacts
exports.getContacts = (req, res) => {
  db.query(
    `SELECT *
     FROM important_contacts
     ORDER BY category, name`,
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json(results);
    }
  );
};

// Add Contact
exports.addContact = (req, res) => {
  const {
    name,
    designation,
    phone,
    category,
  } = req.body;

  if (
    !name ||
    !designation ||
    !phone ||
    !category
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  db.query(
    `INSERT INTO important_contacts
    (name, designation, phone, category)
    VALUES (?, ?, ?, ?)`,
    [
      name,
      designation,
      phone,
      category,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message: "Contact added successfully",
        contactId: result.insertId,
      });
    }
  );
};

// Update Contact
exports.updateContact = (req, res) => {
  const { id } = req.params;

  const {
    name,
    designation,
    phone,
    category,
  } = req.body;

  db.query(
    `UPDATE important_contacts
     SET
       name = ?,
       designation = ?,
       phone = ?,
       category = ?
     WHERE id = ?`,
    [
      name,
      designation,
      phone,
      category,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Contact not found",
        });
      }

      res.json({
        message: "Contact updated successfully",
      });
    }
  );
};

// Delete Contact
exports.deleteContact = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM important_contacts WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Contact not found",
        });
      }

      res.json({
        message: "Contact deleted successfully",
      });
    }
  );
};