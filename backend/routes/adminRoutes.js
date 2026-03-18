const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ONLY ADMIN CAN ACCESS
router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: "Welcome Admin 🚀",
  });
});

module.exports = router;