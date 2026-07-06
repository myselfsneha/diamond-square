const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");

// Get all contacts
router.get("/", contactController.getContacts);

// Get single contact
router.get("/:id", contactController.getContact);

// Create contact
router.post("/", contactController.createContact);

// Update contact
router.put("/:id", contactController.updateContact);

// Delete contact
router.delete("/:id", contactController.deleteContact);

module.exports = router;