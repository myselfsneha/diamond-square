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
  switchDashboard,
  logout,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

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

// ==============================
// OTP
// ==============================
router.post("/verify-otp", verifyOtp);
router.post("/verify-otp-code", verifyOtpWithCode);

// ==============================
// Profile (Protected)
// ==============================
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.put(
  "/change-password",
  protect,
  changePassword
);

// ==============================
// Dashboard Switch
// ==============================
router.post(
  "/switch-dashboard",
  protect,
  switchDashboard
);

// ==============================
// Logout
// ==============================
router.post("/logout", protect, logout);

module.exports = router;