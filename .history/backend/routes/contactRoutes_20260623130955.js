const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

// All authenticated users
router.get(
  "/",
  authMiddleware,
  getContacts
);

// Admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  addContact
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateContact
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteContact
);

module.exports = router;