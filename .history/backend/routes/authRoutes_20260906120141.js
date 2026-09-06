const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyOtp,
  verifyOtpWithCode,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
  switchDashboard,
  logout,
} = require("../controllers/authController");

// Authentication
router.post("/register", register);
router.post("/login", login);

// Email Verification
router.post("/verify-otp", verifyOtp);
router.post("/verify-otp-code", verifyOtpWithCode);

// Forgot Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
