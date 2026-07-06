const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

// Get all contacts
router.get(
  "/",
  authMiddleware,
  getContacts
);

// Get single contact
router.get(
  "/:id",
  authMiddleware,
  getContact
);

// Create contact
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createContact
);

// Update contact
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateContact
);

// Delete contact
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteContact
);

module.exports = router;