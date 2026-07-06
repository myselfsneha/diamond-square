const express = require("express");
const router = express.Router();

const {
  getPendingUsers,
  getAllUsers,
  approveUser,
  rejectUser,
  toggleUserStatus,
  toggleAdminRole,
  deleteUser,
  approveResident,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// ===============================
// Pending Users
// ===============================
router.get(
  "/pending-users",
  protect,
  adminOnly,
  getPendingUsers
);

// ===============================
// All Users
// ===============================
router.get(
  "/all-users",
  protect,
  adminOnly,
  getAllUsers
);

// ===============================
// Residents
// ===============================
router.get(
  "/residents",
  protect,
  adminOnly,
  getAllUsers
);

// ===============================
// NEW APPROVE RESIDENT (OTP)
// ===============================
router.put(
  "/approve/:userId",
  protect,
  adminOnly,
  approveResident
);

// ===============================
// Approve User
// ===============================
router.put(
  "/approve-user/:id",
  protect,
  adminOnly,
  approveUser
);

// ===============================
// Reject User
// ===============================
router.put(
  "/reject-user/:id",
  protect,
  adminOnly,
  rejectUser
);

// ===============================
// Activate / Deactivate User
// ===============================
router.put(
  "/toggle-status/:id",
  protect,
  adminOnly,
  toggleUserStatus
);

// ===============================
// Make Admin / Remove Admin
// ===============================
router.put(
  "/toggle-admin/:id",
  protect,
  adminOnly,
  toggleAdminRole
);

// ===============================
// Delete User
// ===============================
router.delete(
  "/delete-user/:id",
  protect,
  adminOnly,
  deleteUser
);

module.exports = router;