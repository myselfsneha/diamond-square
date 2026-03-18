const express = require("express");
const router = express.Router();

const {
  createNotice,
  getNotices,
} = require("../controllers/noticeController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ADMIN ONLY
router.post("/", authMiddleware, adminMiddleware, createNotice);

// ALL USERS
router.get("/", authMiddleware, getNotices);

module.exports = router;