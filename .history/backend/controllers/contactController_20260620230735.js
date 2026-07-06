const db = require("../config/db");

// Get All Contacts
exports.getContacts = (req, res) => {
  db.query(
    "SELECT * FROM important_contacts ORDER BY category, name",
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message
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
    category
  } = req.body;

  db.query(
    `INSERT INTO important_contacts
    (name, designation, phone, category)
    VALUES (?, ?, ?, ?)`,
    [name, designation, phone, category],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.status(201).json({
        message: "Contact added successfully"
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
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        message: "Contact deleted successfully"
      });
    }
  );
};