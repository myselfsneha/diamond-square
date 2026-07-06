const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getPendingUsers,
  approveUser,
  getAllResidents,
  deleteResident,
} = require("../controllers/adminController");

// Pending Users
router.get(
  "/pending-users",
  authMiddleware,
  adminMiddleware,
  getPendingUsers
);

router.put(
  "/approve-user/:id",
  authMiddleware,
  adminMiddleware,
  approveUser
);

// Residents
router.get(
  "/residents",
  authMiddleware,
  adminMiddleware,
  getAllResidents
);

router.delete(
  "/residents/:id",
  authMiddleware,
  adminMiddleware,
  deleteResident
);

module.exports = router;