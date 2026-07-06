const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getContacts,
  addContact,
  deleteContact
} = require("../controllers/contactController");

router.get(
  "/",
  authMiddleware,
  getContacts
);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  addContact
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteContact
);

module.exports = router;