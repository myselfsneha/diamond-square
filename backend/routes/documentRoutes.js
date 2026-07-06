const express = require("express");
const path = require("path");
const multer = require("multer");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDocuments,
  uploadDocument,
  downloadDocument,
  deleteDocument,
} = require("../controllers/documentController");

// ================================
// Multer Configuration
// ================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/documents"));
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

// ================================
// Routes
// ================================

// Get all documents (Resident + Admin)
router.get(
  "/",
  authMiddleware,
  getDocuments
);

// Upload document (Admin)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("document"),
  uploadDocument
);

// Download document (Resident + Admin)
router.get(
  "/download/:id",
  authMiddleware,
  downloadDocument
);

// Delete document (Admin)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteDocument
);

module.exports = router;