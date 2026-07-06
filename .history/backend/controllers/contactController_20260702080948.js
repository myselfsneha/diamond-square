const Contact = require("../models/contactModel");

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.getAllContacts();
    res.json(contacts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch contacts."
    });
  }
};

exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.getContactById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found."
      });
    }

    res.json(contact);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error."
    });
  }
};

exports.createContact = async (req, res) => {
  try {
    const id = await Contact.createContact(req.body);

    res.status(201).json({
      message: "Contact created successfully.",
      id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to create contact."
    });
  }
};

exports.updateContact = async (req, res) => {
  try {
    await Contact.updateContact(req.params.id, req.body);

    res.json({
      message: "Contact updated successfully."
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to update contact."
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await Contact.deleteContact(req.params.id);

    res.json({
      message: "Contact deleted successfully."
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to delete contact."
    });
  }
};