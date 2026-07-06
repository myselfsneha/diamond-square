const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createNotice,
  getAllNotices,
  deleteNotice,
} = require("../controllers/noticeController");

// Get all notices (Resident + Admin)
router.get(
  "/",
  authMiddleware,
  getAllNotices
);

// Create notice (Admin)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createNotice
);

// Delete notice (Admin)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteNotice
);

module.exports = router;