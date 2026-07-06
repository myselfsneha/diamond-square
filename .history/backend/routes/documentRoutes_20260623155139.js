const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDocuments,
  createDocument,
  deleteDocument,
} = require("../controllers/documentController");

// All authenticated users
router.get(
  "/",
  authMiddleware,
  getDocuments
);

// Admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createDocument
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteDocument
);

module.exports = router;