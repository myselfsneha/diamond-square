const Contact = require("../models/contactModel");

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.getAllContacts();

    return res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.getContactById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    return res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error("Get Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createContact = async (req, res) => {
  try {
    const { name, designation, phone } = req.body;

    if (!name || !designation || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const id = await Contact.createContact(req.body);

    return res.status(201).json({
      success: true,
      message: "Contact created successfully.",
      contactId: id,
    });
  } catch (error) {
    console.error("Create Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.getContactById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    await Contact.updateContact(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully.",
    });
  } catch (error) {
    console.error("Update Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.getContactById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    await Contact.deleteContact(id);

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};