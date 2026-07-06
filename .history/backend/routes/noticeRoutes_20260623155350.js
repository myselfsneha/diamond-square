const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createNotice,
  getAllNotices,
} = require("../controllers/noticeController");

// All authenticated users
router.get(
  "/",
  authMiddleware,
  getAllNotices
);

// Admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createNotice
);

module.exports = router;