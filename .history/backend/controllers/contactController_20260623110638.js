const db = require("../config/db");

// Get All Contacts
exports.getContacts = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT *
       FROM important_contacts
       ORDER BY category, name`
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Contact
exports.addContact = async (req, res) => {
  try {
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

    const [result] = await db.query(
      `INSERT INTO important_contacts
      (name, designation, phone, category)
      VALUES (?, ?, ?, ?)`,
      [
        name,
        designation,
        phone,
        category,
      ]
    );

    res.status(201).json({
      message: "Contact added successfully",
      contactId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Contact
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;

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

    const [result] = await db.query(
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
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.json({
      message: "Contact updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM important_contacts WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};