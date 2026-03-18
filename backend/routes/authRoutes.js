const express = require("express");
const router = express.Router();

const {
  register,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// PUBLIC
router.post("/register", register);
router.post("/login", loginUser);

// PROTECTED
router.get("/me", authMiddleware, getProfile);

module.exports = router;