const express = require("express");
const router = express.Router();

const {
  getPendingUsers,
  getPendingCount,
  approveUser,
  rejectUser,
  getAllResidents,
  deleteResident,
} = require("../controllers/adminController");

// Pending Approvals
router.get("/pending-users", getPendingUsers);
router.get("/pending-count", getPendingCount);
router.put("/approve-user/:id", approveUser);
router.put("/reject-user/:id", rejectUser);

// Residents
router.get("/residents", getAllResidents);
router.delete("/residents/:id", deleteResident);

module.exports = router;