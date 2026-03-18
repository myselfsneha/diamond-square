const express = require("express");
const router = express.Router();

const {
  register,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// PUBLIC ROUTES
router.post("/register", register);
router.post("/login", loginUser);

// PROTECTED ROUTE
router.get("/me", authMiddleware, getProfile);

module.exports = router;