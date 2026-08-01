const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyOtp,
  verifyOtpWithCode,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
  switchDashboard,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// ==============================
// Test Route
// ==============================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Routes Working",
  });
});

// ==============================
// Authentication
// ==============================
router.post("/register", register);
router.post("/login", login);

// Email OTP Verification
router.post("/verify-otp", verifyOtp);
router.post("/verify-otp-code", verifyOtpWithCode);

// Password Reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ==============================
// Profile
// ==============================
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);
router.post("/upload-profile-image", uploadProfileImage);

// ==============================
// Dashboard
// ==============================
router.post("/switch-dashboard", switchDashboard);

// ==============================
// Logout
// ==============================
router.post("/logout", logout);

module.exports = router;